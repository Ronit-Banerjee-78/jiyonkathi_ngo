# Comprehensive Code Review: Jiyonkathi NGO Website

**Date:** 2026-09-02
**Scope:** Full workspace review (backend, frontend, infrastructure)

---

## 🔴 CRITICAL ISSUES

### 1. **SQL Injection Vulnerability in Settings Controller**

**File:** [server/controllers/settingsController.js](server/controllers/settingsController.js#L62)
**Line:** 62

**Issue:**

```javascript
const jsonString = JSON.stringify(data).replace(/'/g, "''");
await pool.query(`INSERT INTO site_settings (data) VALUES ('${jsonString}')`);
```

**Why it matters:**

- String interpolation with manual quote escaping is NOT safe against SQL injection
- Backslashes, comment characters, or other special sequences can bypass the escape
- A malicious user sending specific JSON payloads could execute arbitrary SQL
- This violates OWASP Top 10 A03:2021 (Injection)

**Fix:**

```javascript
// Use parameterized queries (prepared statements)
await pool.query(
  `INSERT INTO site_settings (data) VALUES ($1)`,
  [data], // PostgreSQL will handle JSON serialization safely
);
```

---

### 2. **SQL Injection Vulnerability in Database Initialization**

**File:** [server/models/db.js](server/models/db.js#L202)
**Line:** ~202 (in seedData initialization)

**Issue:**
Similar to above - manual string escaping in INSERT statement:

```javascript
const jsonString = JSON.stringify(initialData).replace(/'/g, "''");
// Later:
await client.query(
  `INSERT INTO site_settings (data) VALUES ('${jsonString}'::jsonb)`,
);
```

**Why it matters:**

- Same injection risk as settingsController
- Happens during database initialization, affecting system startup

**Fix:**

```javascript
await client.query(`INSERT INTO site_settings (data) VALUES ($1::jsonb)`, [
  initialData,
]);
```

---

### 3. **Missing Database Connection Release (Memory Leak)**

**File:** [server/models/db.js](server/models/db.js#L60-L230)
**Lines:** 60-230 (initDB function)

**Issue:**

```javascript
const client = await pool.connect();
try {
  await client.query(`CREATE TABLE IF NOT EXISTS ...`);
  // ... more operations ...
  // NO client.release() call!
} catch (seedErr) {
  console.warn("Could not seed default reports:", seedErr.message);
  // Memory leak: client is never released
}
```

**Why it matters:**

- Connection pooling assumes clients are released back to the pool
- Without release, connections pile up and become unavailable
- Eventually leads to connection pool exhaustion and server hang
- The `finally` block is missing

**Fix:**

```javascript
const client = await pool.connect();
try {
  await client.query(`CREATE TABLE IF NOT EXISTS ...`);
  // ... operations ...
} catch (seedErr) {
  console.warn("Could not seed default reports:", seedErr.message);
} finally {
  client.release(); // Always release
}
```

---

### 4. **No Authentication/Authorization on Admin Endpoints**

**Files:**

- [server/controllers/settingsController.js](server/controllers/settingsController.js)
- [server/controllers/reportController.js](server/controllers/reportController.js)
- [server/controllers/uploadController.js](server/controllers/uploadController.js)

**Issue:**
POST, PUT, DELETE endpoints allow ANY user (authenticated or not) to:

- Modify site settings
- Create/delete reports
- Upload files to the database
- Approve/reject volunteers
- Delete events

```javascript
// NO authentication check
router.post("/", async (req, res) => {
  const newVol = {/* ... */};
  memoryVolunteers.unshift(newVol); // Anyone can add volunteers!
  // ...
});
```

**Why it matters:**

- Anyone with network access can modify your site content
- Volunteers can be impersonated or spam added
- Settings can be changed maliciously
- This violates OWASP A01:2021 (Broken Access Control)

**Fix:**

```javascript
// Create authentication middleware
export const requireAuth = (req, res, next) => {
  const authToken = req.headers.authorization?.replace("Bearer ", "");
  if (!authToken || authToken !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  next();
};

// Apply to all admin routes
router.post("/", requireAuth, async (req, res) => {
  /* ... */
});
```

---

### 5. **Database Client Not Released in Multiple Endpoints**

**File:** [server/controllers/volunteerController.js](server/controllers/volunteerController.js#L140-L160)
**Lines:** 140-160 (volunteer approval/rejection)

**Issue:**

```javascript
if (isDbConnected) {
  try {
    const client = await pool.connect();
    await client.query("BEGIN");
    // ... multiple queries ...
    await client.query("COMMIT");
    // client.release() is missing!
  } catch (err) {
    console.error("Error updating volunteer status:", err.message);
    // Connection still not released
  }
}
```

**Why it matters:**

- Same connection leak issue as #3
- Repeated API calls exhaust the connection pool
- Server becomes unresponsive after several volunteer approvals

**Fix:**

```javascript
if (isDbConnected) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // ... operations ...
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error updating volunteer status:", err.message);
  } finally {
    client.release();
  }
}
```

---

## 🟠 HIGH SEVERITY ISSUES

### 6. **Weak Email Validation**

**File:** [server/controllers/volunteerController.js](server/controllers/volunteerController.js#L110)
**Line:** 110

**Issue:**

```javascript
if (!name || !email) {
  return res
    .status(400)
    .json({ success: false, error: "Name and Email are required" });
}
// Email is accepted even if it's not a valid email format
```

**Why it matters:**

- Invalid email formats are accepted and stored in database
- Could cause issues with volunteer contact
- No data validation on other fields (phone, URL fields, etc.)

**Fix:**

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res
    .status(400)
    .json({ success: false, error: "Invalid email format" });
}
```

---

### 7. **Unhandled Async Errors in Upload Handler**

**File:** [server/controllers/uploadController.js](server/controllers/uploadController.js#L24-L36)
**Lines:** 24-36

**Issue:**

```javascript
router.post(
  "/",
  strictUploadLimiter,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({
          success: false,
          error:
            err.message === "File too large"
              ? "File exceeds maximum allowed size (120MB)"
              : err.message, // Leaking internal error messages!
        });
      }
      next();
    });
  },
  async (req, res) => {
    // Async handler without try-catch at this level
    // If next() fails, unhandled rejection
  },
);
```

**Why it matters:**

- Internal error details exposed to clients (security issue)
- Async errors in the handler might not be caught properly
- Request could hang if there's an unhandled error

**Fix:**

```javascript
router.post("/", strictUploadLimiter, async (req, res, next) => {
  try {
    // Handle multer
    await new Promise((resolve, reject) => {
      upload.single("file")(req, res, (err) => {
        if (err) {
          return reject(new Error("File upload failed"));
        }
        resolve();
      });
    });

    // Handle main logic with proper error catching
    const { originalname, mimetype, buffer } = req.file;
    // ...
  } catch (error) {
    return res.status(400).json({ success: false, error: "Upload failed" });
  }
});
```

---

### 8. **Missing Environment Variable Validation**

**File:** [server.js](server.js#L29)
**Lines:** 1-35

**Issue:**
No validation that required environment variables exist:

```javascript
const PORT = process.env.PORT || 3000;
// What if CLOUDINARY_API_KEY is partially set?
// What if DATABASE_URL is malformed?
// No validation occurs
```

**Why it matters:**

- Silent failures if env vars are incomplete
- Server might start in degraded state without knowing
- Hard to debug in production

**Fix:**

```javascript
const requiredEnvVars = ["ADMIN_SECRET"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`,
  );
  process.exit(1);
}
```

---

### 9. **Race Condition in Rate Limiter**

**File:** [server/middlewares/rateLimiterMiddleware.js](server/middlewares/rateLimiterMiddleware.js#L10-50)
**Lines:** 10-50

**Issue:**

```javascript
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  maxRequests = 100,
  message = "Too many requests, please try again later.",
} = {}) => {
  return (req, res, next) => {
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown-ip";
    const now = Date.now();

    let record = ipRequestMap.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipRequestMap.set(clientIp, record);
    } else {
      record.count += 1;
    }
    // Race condition: Between get and set operations, another request could modify the map
  };
};
```

**Why it matters:**

- In high concurrency, same IP could exceed limit before being rate-limited
- Rate limiting effectiveness reduced
- Two concurrent requests with same IP might both see count=0

**Fix:**

```javascript
// Use synchronous operation or implement proper locking
const record = ipRequestMap.get(clientIp) || { count: 0, resetTime: 0 };
const now = Date.now();

if (now > record.resetTime) {
  record = { count: 1, resetTime: now + windowMs };
} else {
  record.count++;
}
ipRequestMap.set(clientIp, record); // Set once, atomically
```

---

### 10. **Unbounded Memory Growth in Upload Handler**

**File:** [server/controllers/uploadController.js](server/controllers/uploadController.js#L14-18)
**Lines:** 14-18

**Issue:**

```javascript
const memoryFiles = new Map();
let nextFileId = 1;

// In the upload endpoint:
const fileId = nextFileId++;
memoryFiles.set(String(fileId), {
  filename: originalname,
  mimetype,
  data: buffer, // 120MB file added to memory!
});
// No cleanup mechanism - files stay in memory forever
```

**Why it matters:**

- Each uploaded file (up to 120MB) stays in RAM indefinitely
- Memory usage grows unbounded
- After several uploads, server runs out of memory and crashes
- No TTL or size limit

**Fix:**

```javascript
// Use a Map with auto-expiring entries
class ExpiringMap {
  constructor(ttlMs = 24 * 60 * 60 * 1000) {
    this.map = new Map();
    this.ttlMs = ttlMs;
  }

  set(key, value) {
    this.map.set(key, value);
    setTimeout(() => this.map.delete(key), this.ttlMs);
  }

  get(key) {
    return this.map.get(key);
  }
}

const memoryFiles = new ExpiringMap(24 * 60 * 60 * 1000); // 24-hour TTL
```

---

### 11. **No CORS or Csrf Protection**

**File:** [server.js](server.js#L31-50)

**Issue:**

```javascript
const app = express();
// No CORS middleware configured
// No CSRF protection
// No rate limiting by endpoint type

app.use(express.json({ limit: "50mb" }));
// Accepts 50MB JSON payloads from anywhere
```

**Why it matters:**

- Browser-based CSRF attacks are possible
- Frontend could be served from different domain
- Cross-origin file uploads could be exploited

**Fix:**

```javascript
import cors from "cors";
import csrf from "csurf";

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(csrf({ cookie: false }));
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### 12. **Inconsistent Error Messages Leak Information**

**File:** [server/controllers/settingsController.js](server/controllers/settingsController.js#L28-32)

**Issue:**

```javascript
// Some endpoints return detailed errors:
res.status(500).json({ success: false, error: error.message });

// Others return generic:
res.status(500).json({ success: false, error: "Database error" });
```

**Why it matters:**

- Information disclosure vulnerability
- Attackers can infer system details from error messages
- Should be consistent and generic in production

**Fix:**

```javascript
const isDev = process.env.NODE_ENV === "development";
const errorMsg = isDev ? error.message : "An error occurred";
res.status(500).json({ success: false, error: errorMsg });
```

---

### 13. **Missing Null/Undefined Checks**

**File:** [server/models/projectModel.js](server/models/projectModel.js#L12-15)

**Issue:**

```javascript
export const getAllProjects = async () => {
  if (!isDbConnected) {
    return inMemoryProjects;
  }
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
    return result.rows; // Could be undefined if result is null
  } catch (error) {
    console.error(
      "Error fetching from DB, returning memory projects:",
      error.message,
    );
    return inMemoryProjects;
  }
};
```

**Why it matters:**

- Callers expect an array, might get undefined
- Could cause crashes in frontend when iterating

**Fix:**

```javascript
const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
return result?.rows ?? [];
```

---

### 14. **Rate Limiter Unbounded Memory Growth**

**File:** [server/middlewares/rateLimiterMiddleware.js](server/middlewares/rateLimiterMiddleware.js#L6-16)

**Issue:**

```javascript
// Clean up stale IP records every 10 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of ipRequestMap.entries()) {
      if (now - data.resetTime > 15 * 60 * 1000) {
        ipRequestMap.delete(ip);
      }
    }
  },
  10 * 60 * 1000,
);
```

**Why it matters:**

- If there are 10,000+ unique IPs, the cleanup loop takes time
- 10 minutes between cleanups means up to 10 minutes of stale data
- A spike in unique IPs could cause OOM

**Fix:**

```javascript
// Use more frequent cleanup and set a hard limit
setInterval(
  () => {
    // ... cleanup code ...

    // If too many IPs, clear oldest entries
    if (ipRequestMap.size > 100000) {
      const entries = Array.from(ipRequestMap.entries());
      entries.sort((a, b) => a[1].resetTime - b[1].resetTime);
      entries.slice(0, entries.length - 50000).forEach(([ip]) => {
        ipRequestMap.delete(ip);
      });
    }
  },
  2 * 60 * 1000,
); // Every 2 minutes instead of 10
```

---

### 15. **No Input Sanitization on File Names**

**File:** [server/controllers/uploadController.js](server/controllers/uploadController.js#L49-52)

**Issue:**

```javascript
const { originalname, mimetype, buffer } = req.file;
// originalname is used directly in Content-Disposition header
res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
```

**Why it matters:**

- Malicious file names could contain special characters
- Could be exploited for header injection
- File name not sanitized before storage

**Fix:**

```javascript
const sanitizedFilename = originalname
  .replace(/[^a-zA-Z0-9._-]/g, "_")
  .slice(0, 100);

res.setHeader("Content-Disposition", `inline; filename="${sanitizedFilename}"`);
```

---

### 16. **No Validation of Volunteer Data Structure**

**File:** [server/controllers/volunteerController.js](server/controllers/volunteerController.js#L115-130)

**Issue:**

```javascript
const {
  name,
  email,
  phone,
  program,
  location,
  availability,
  skills,
  motivation,
  isDdbmpbs,
} = req.body;

if (!name || !email) {
  return res
    .status(400)
    .json({ success: false, error: "Name and Email are required" });
}
// No validation of field types or lengths
// isDdbmpbs could be any value, not just boolean

const newVol = {
  isDdbmpbs: Boolean(isDdbmpbs), // Coerces any truthy value to true
  // ...
};
```

**Why it matters:**

- Could store invalid data
- No protection against XSS in stored fields
- Max length not enforced (could store gigabytes of text)

**Fix:**

```javascript
const validateVolunteerData = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.length > 100) {
    errors.push("Name must be a string (1-100 chars)");
  }

  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Invalid email format");
  }

  if (data.phone && typeof data.phone !== "string") {
    errors.push("Phone must be a string");
  }

  // ... more validations ...

  return errors.length === 0 ? null : errors;
};

const errors = validateVolunteerData(req.body);
if (errors) return res.status(400).json({ success: false, errors });
```

---

### 17. **Frontend: No Error Handling for Failed API Calls**

**File:** [src/services/apiClient.js](src/services/apiClient.js)

**Issue:**

```javascript
export const apiClient = {
  async get(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status} ${response.statusText}`,
        );
      }
      return await response.json();
    } catch (error) {
      console.error(`[API GET Error] ${url}:`, error);
      throw error; // Throws but doesn't return default value
    }
  },
};
```

**Why it matters:**

- Callers must handle thrown errors
- No fallback data provided
- Context component doesn't catch these errors properly

**Fix:**

```javascript
async get(url, defaultValue = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`[API GET Error] ${url}:`, error);
    return defaultValue;  // Return default instead of throwing
  }
}
```

---

### 18. **Frontend: SiteContext Loads Indefinitely**

**File:** [src/context/SiteContext.jsx](src/context/SiteContext.jsx#L120-140)

**Issue:**

```javascript
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSettings = async () => {
    try {
      const data = await settingsService.fetchSettings();
      // ... sets data ...
    } catch (error) {
      console.warn("Using default site data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchSettings();
}, []);
```

**Why it matters:**

- If API fails silently, loading is still set to false
- But if API throws and is not caught, promise rejection
- No timeout - could load forever if server doesn't respond

**Fix:**

```javascript
useEffect(() => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

  const fetchSettings = async () => {
    try {
      const data = await settingsService.fetchSettings();
      // ...
    } catch (error) {
      console.warn("Using default site data:", error.message);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  fetchSettings();

  return () => {
    controller.abort();
    clearTimeout(timeoutId);
  };
}, []);
```

---

### 19. **Firebase Storage REST API Not Authenticated**

**File:** [server/services/firebaseService.js](server/services/firebaseService.js#L25-35)

**Issue:**

```javascript
export async function uploadToFirebaseStorage({ filename, mimetype, buffer }) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase Storage credentials are not configured.");
  }

  const bucket = process.env.FIREBASE_STORAGE_BUCKET;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const encodedPath = encodeURIComponent(`uploads/${Date.now()}_${filename}`);

  // Using REST API without authentication token!
  const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodedPath}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": mimetype },
    body: buffer,
  });
  // This will fail unless Firebase bucket is public (security issue!)
}
```

**Why it matters:**

- Firebase REST API requires authentication token
- Without it, uploads will fail
- If bucket is made public to work around this, it becomes a security issue

**Fix:**

```javascript
// Use Firebase Admin SDK instead
import admin from "firebase-admin";

export async function uploadToFirebaseStorage({ filename, mimetype, buffer }) {
  const bucket = admin.storage().bucket();
  const file = bucket.file(`uploads/${Date.now()}_${filename}`);

  await file.save(buffer, {
    metadata: { contentType: mimetype },
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
  return { success: true, url };
}
```

---

## 🔵 LOW SEVERITY ISSUES / SUGGESTIONS

### 20. **Logger Middleware Too Verbose**

**File:** [server/middlewares/loggerMiddleware.js](server/middlewares/loggerMiddleware.js)

**Suggestion:**

```javascript
export const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
```

**Better approach:**

```javascript
export const logger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? "WARN" : "INFO";
    console.log(
      `[${level}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
};
```

---

### 21. **Unnecessary useContext in Custom Hook**

**File:** [src/hooks/useSite.js](src/hooks/useSite.js)

**Current:**

```javascript
export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within a SiteProvider");
  }
  return context;
};
```

**This is good practice** ✓ - Proper error handling for missing provider.

---

### 22. **Multiple Fallback Storage Layers Add Complexity**

**File:** [server/controllers/uploadController.js](server/controllers/uploadController.js#L42-130)

**Observation:**
The 4-tier fallback (Cloudinary → Firebase → PostgreSQL → Memory) is good for resilience but adds testing complexity. Consider:

**Suggestion:**

```javascript
// Add logging to understand which storage is being used
console.log(`[UPLOAD] Using ${storage} storage for ${originalname}`);

// Monitor fallback usage
if (storage !== "cloudinary") {
  console.warn(`[UPLOAD FALLBACK] Cloudinary not available, using ${storage}`);
}
```

---

### 23. **Hardcoded Dates and Test Data**

**File:** [server/controllers/volunteerController.js](server/controllers/volunteerController.js#L7-40)

**Issue:**

```javascript
createdAt: new Date("2026-07-28").toISOString();
```

**Suggestion:**
Move test data to a separate `seedData.js` file and only seed if DB is empty. Don't hardcode test data in production routes.

---

### 24. **No Environment Variable Documentation**

**All files**

**Suggestion:**
Create a `.env.example` file documenting all required and optional environment variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost/dbname
# OR
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=
DB_NAME=dbname
DB_PORT=5432

# Security
ADMIN_SECRET=your-secret-key-here

# Media Storage
CLOUDINARY_URL=cloudinary://...
FIREBASE_STORAGE_BUCKET=project.appspot.com
FIREBASE_PROJECT_ID=project-id

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://example.com

# Optional
DISABLE_HMR=false
```

---

### 25. **Package.json Missing Important Dependencies**

**File:** [package.json](package.json)

**Missing security packages:**

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "joi": "^17.11.0",
    "dotenv": "^17.4.2"
  }
}
```

**Note:** These should be added for production use.

---

### 26. **No Request Validation Schema**

**All controllers**

**Suggestion:**
Use a schema validator (Joi, Zod, or similar) for all endpoints:

```javascript
import Joi from "joi";

const volunteerSchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional(),
  program: Joi.string().max(200).optional(),
  location: Joi.string().max(200).optional(),
  availability: Joi.string().max(100).optional(),
  skills: Joi.string().max(500).optional(),
  motivation: Joi.string().max(1000).optional(),
  isDdbmpbs: Joi.boolean().optional(),
});

router.post("/", async (req, res) => {
  const { error, value } = volunteerSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  // Use validated 'value', not req.body
});
```

---

### 27. **Race Condition: Volunteer Status Updates**

**File:** [server/controllers/volunteerController.js](server/controllers/volunteerController.js#L195-225)

**Issue:**
Updating volunteer status in both memory and DB, but they can get out of sync if one fails.

**Suggestion:**

```javascript
// Always treat DB as source of truth
if (isDbConnected) {
  // Update DB
  const result = await pool.query(
    "UPDATE volunteers SET status = $1 WHERE id = $2 RETURNING *",
    [status, id],
  );
  return result.rows[0];
} else {
  // Only update memory
  const vol = memoryVolunteers.find((v) => v.id === id);
  if (vol) vol.status = status;
  return vol;
}
```

---

### 28. **No HTTPS Redirect in Production**

**File:** [server.js](server.js)

**Suggestion:**

```javascript
// Add HTTPS redirect middleware
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.get("host")}${req.url}`);
    }
    next();
  });
}
```

---

### 29. **Missing Health Check Endpoints for Monitoring**

**Suggestion:**
The `/api/health` endpoint exists but is too simple:

```javascript
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Add detailed health check
app.get("/api/health/detailed", async (req, res) => {
  const checks = {
    database: await checkDatabaseConnection(),
    cloudinary: isCloudinaryConfigured(),
    firebase: isFirebaseConfigured(),
  };
  res.json(checks);
});
```

---

### 30. **No Request Logging for Audit Trail**

**Suggestion:**
Add audit logging for sensitive operations:

```javascript
const auditLog = (action, userId, details, success = true) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      success,
    }),
  );
};

// In volunteer approval:
auditLog("VOLUNTEER_APPROVED", adminId, { volunteerId: id }, true);
```

---

## Summary Table

| Severity    | Count | Category                                         |
| ----------- | ----- | ------------------------------------------------ |
| 🔴 Critical | 5     | SQL Injection, Auth, Memory Leaks                |
| 🟠 High     | 6     | Validation, Error Handling, CORS                 |
| 🟡 Medium   | 8     | Data Validation, Error Messages, Race Conditions |
| 🔵 Low      | 11    | Best Practices, Documentation, Monitoring        |

---

## Immediate Action Items (Priority Order)

1. **Fix SQL Injection** (Critical) - Lines 62 in settingsController.js, line 202 in db.js
2. **Add Database Connection Release** (Critical) - Wrap all client.query() in try-finally
3. **Implement Authentication** (Critical) - Add auth middleware to all POST/PUT/DELETE routes
4. **Fix Email Validation** (High) - Validate email format before storing
5. **Add Environment Variable Validation** (High) - Validate on startup
6. **Implement Request Schema Validation** (High) - Use Joi or Zod for all endpoints

---

## Recommended Tools & Libraries

```json
{
  "dependencies": {
    "express": "^5.2.1",
    "pg": "^8.22.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "joi": "^17.11.0",
    "dotenv": "^17.4.2"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.10.0"
  }
}
```

---

**Review Completed:** 2026-09-02
**Reviewer:** AI Code Analyst
