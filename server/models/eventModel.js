import pool, { isDbConnected } from "./db.js";

// Seed default events for initial in-memory state or DB seeding
const INITIAL_EVENTS = [
  {
    id: "evt-1",
    title: "বসন্ত উৎসব ও বার্ষিক লোকোৎসব ২০২৬",
    title_english: "Spring & Annual Folk Festival 2026",
    date_str: "আগস্ট ১৫, ২০২৬",
    date_english: "August 15, 2026",
    time_str: "সকাল ০৭:০০ - বেলা ১১:০০",
    time_english: "07:00 AM - 11:00 AM",
    location: "জিয়নকাঠি প্রাঙ্গণ, প্রতাপপুর, আউশগ্রাম",
    location_english: "Jiyonkathi Farm, Pratappur, Aushgram",
    description:
      "জিয়নকাঠির প্রাঙ্গণে শিশুদের সহপ্রকৃতি পাঠ, বাউল ও পরিবেশ সচেতনতার বিশেষ অনুষ্ঠান।",
    full_details:
      "গ্রাম জীবনের ছন্দ অনুসরণ করে প্রতিবছর জিয়নকাঠির মাঠে উদযাপিত হয় লোকোৎসব। এই বার্ষিক অনুষ্ঠানে গ্রামের শিশু ও পরিবারবর্গের পরিবেশ সচেতনতা বৃদ্ধি, দেশীয় ধান রোপণ সংস্কৃতি উদযাপন, বাউল সঙ্গীত পরিবেশনা এবং ঐতিহ্যবাহী প্রীতিভোজের আয়োজন করা হয়।",
    full_details_english:
      "Following the rhythmic cadence of rural life, this annual festival brings together village families, folk music artists, and ecological advocates.",
    image: "/images/community-collage.jpg",
    category: "সংস্কৃতি",
    category_english: "Culture",
    status: "upcoming",
    spots_left: 42,
    total_spots: 150,
    our_work_ref: null,
    created_at: new Date(),
  },
  {
    id: "evt-2",
    title: "সহায়ক শিক্ষা কেন্দ্র শিক্ষাসামগ্রী বিতরণ",
    title_english: "Education Center Learning Kits Drive",
    date_str: "সেপ্টেম্বর ৫, ২০২৬",
    date_english: "September 5, 2026",
    time_str: "সকাল ১০:০০ - বৈকাল ০৪:০০",
    time_english: "10:00 AM - 04:00 PM",
    location: "জিয়নকাঠি সহায়ক শিক্ষা কেন্দ্র",
    location_english: "Jiyonkathi Education Center",
    description:
      "গ্রামীণ শিশুদের বিনামূল্যে খাতা, কলম, ছবি আঁকার সামগ্রী ও শিক্ষা উপকরণ বিতরণ কর্মসূচি।",
    full_details:
      "জিয়নকাঠির সহায়ক শিক্ষা কেন্দ্রে অধ্যয়নরত গ্রামীণ শিক্ষার্থীদের সামগ্রিক বিকাশের লক্ষ্যে বিনামূল্যে প্রয়োজনীয় বই, পরিবেশ-বান্ধব শিক্ষা সামগ্রী, অঙ্কন উপকরণ ও পুষ্টিকর টিফিন পরিবেশন করা হবে।",
    full_details_english:
      "Distributing free eco-friendly notebooks, art tools, storybooks, and healthy snacks to rural children attending the Jiyonkathi auxiliary education center.",
    image: "/images/education-center.jpg",
    category: "শিক্ষা",
    category_english: "Education",
    status: "upcoming",
    spots_left: 18,
    total_spots: 60,
    our_work_ref: null,
    created_at: new Date(),
  },
  {
    id: "evt-3",
    title: "বিনামূল্যে স্বাস্থ্য সচেতনতা ও সর্প সচেতনতা শিবির",
    title_english: "Free Health Checkup & Snake Safety Camp",
    date_str: "অক্টোবর ১২, ২০২৬",
    date_english: "October 12, 2026",
    time_str: "সকাল ০৯:০০ - দুপুর ০২:০০",
    time_english: "09:00 AM - 02:00 PM",
    location: "প্রতাপপুর গ্রাম্য স্বাস্থ্য কেন্দ্র প্রাঙ্গণ",
    location_english: "Pratappur Village Health Square",
    description:
      "বিশেষজ্ঞ চিকিৎসক দ্বারা স্বাস্থ্য সচেতনতা শিবির, রক্তচাপ ও ডায়াবেটিস পরীক্ষা এবং বিনামূল্যে ওষুধ বিতরণ।",
    full_details:
      "গ্রামাঞ্চলের কৃষিজীবী মানুষ ও সাধারণ গ্রামবাসীদের জন্য বিশেষজ্ঞ চিকিৎসকদের নিয়ে স্বাস্থ্য পরীক্ষা শিবির, রক্তচাপ ও ডায়াবেটিস নির্ণয়, সাধারণ ওষুধ বিতরণ এবং সর্পদংশন প্রতিরোধে বিশেষ প্রাথমিক চিকিৎসা কর্মশালা।",
    full_details_english:
      "Comprehensive medical screening camp led by specialist doctors, providing free diagnostics, essential medicines, and life-saving snakebite prevention training.",
    image: "/images/health-camp.jpg",
    category: "স্বাস্থ্য",
    category_english: "Healthcare",
    status: "upcoming",
    spots_left: 25,
    total_spots: 80,
    our_work_ref: null,
    created_at: new Date(),
  },
  {
    id: "evt-4",
    title: "দেশীয় ধান বীজ বিনিময় ও রোপণ মেলা",
    title_english: "Indigenous Paddy Seed Exchange & Planting Drive",
    date_str: "মে ১০, ২০২৬",
    date_english: "May 10, 2026",
    time_str: "সকাল ০৯:০০ - দুপুর ০১:০০",
    time_english: "09:00 AM - 01:00 PM",
    location: "জিয়নকাঠি ক্ষেত্র প্রাঙ্গণ",
    location_english: "Jiyonkathi Field Campus",
    description:
      "চাষি ভাইবোনদের মাঝে বিনামূল্যে রাসায়নিক ও বিষমুক্ত দেশীয় প্রজাতির ধানের বীজ বিতরণ ও অভিজ্ঞতা আদান-প্রদান।",
    full_details:
      "এই সফল অনুষ্ঠানে ১২০+ বিরল দেশীয় ধান বীজ বিনামূল্যে স্থানীয় কৃষকদের হাতে তুলে দেওয়া হয়েছে।",
    full_details_english:
      "Over 120 indigenous organic paddy seed varieties were successfully distributed to regional farmers.",
    image: "/images/farming-collage.jpg",
    category: "কৃষি",
    category_english: "Agriculture",
    status: "completed",
    spots_left: 0,
    total_spots: 100,
    our_work_ref: "welf-1",
    created_at: new Date(),
  },
];

let inMemoryEvents = [...INITIAL_EVENTS];

export const getAllEvents = async () => {
  if (!isDbConnected) {
    return inMemoryEvents;
  }
  try {
    const result = await pool.query(
      "SELECT * FROM events ORDER BY created_at DESC, id DESC",
    );
    if (result.rows.length === 0) {
      // Seed initial data to DB if empty
      for (const evt of INITIAL_EVENTS) {
        await pool.query(
          `INSERT INTO events (title, title_english, date_str, date_english, time_str, time_english, location, location_english, description, full_details, full_details_english, image, category, category_english, status, spots_left, total_spots, our_work_ref)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
          [
            evt.title,
            evt.title_english,
            evt.date_str,
            evt.date_english,
            evt.time_str,
            evt.time_english,
            evt.location,
            evt.location_english,
            evt.description,
            evt.full_details,
            evt.full_details_english,
            evt.image,
            evt.category,
            evt.category_english,
            evt.status,
            evt.spots_left,
            evt.total_spots,
            evt.our_work_ref,
          ],
        );
      }
      const seeded = await pool.query(
        "SELECT * FROM events ORDER BY created_at DESC, id DESC",
      );
      return seeded.rows;
    }
    return result.rows;
  } catch (error) {
    console.error(
      "Error fetching events from DB, returning memory list:",
      error.message,
    );
    return inMemoryEvents;
  }
};

export const addEvent = async (eventData) => {
  const {
    title,
    title_english = "",
    date_str = "",
    date_english = "",
    time_str = "",
    time_english = "",
    location = "",
    location_english = "",
    description = "",
    full_details = "",
    full_details_english = "",
    image = "/images/community-collage.jpg",
    category = "সাধারণ",
    category_english = "General",
    status = "upcoming",
    spots_left = 50,
    total_spots = 100,
    our_work_ref = null,
  } = eventData;

  if (!isDbConnected) {
    const newEvent = {
      id: "evt-" + Date.now(),
      title,
      title_english,
      date_str,
      date_english,
      time_str,
      time_english,
      location,
      location_english,
      description,
      full_details,
      full_details_english,
      image,
      category,
      category_english,
      status,
      spots_left: Number(spots_left),
      total_spots: Number(total_spots),
      our_work_ref,
      created_at: new Date(),
    };
    inMemoryEvents.unshift(newEvent);
    return newEvent;
  }

  try {
    const result = await pool.query(
      `INSERT INTO events (
        title, title_english, date_str, date_english, time_str, time_english,
        location, location_english, description, full_details, full_details_english,
        image, category, category_english, status, spots_left, total_spots, our_work_ref
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
      [
        title,
        title_english,
        date_str,
        date_english,
        time_str,
        time_english,
        location,
        location_english,
        description,
        full_details,
        full_details_english,
        image,
        category,
        category_english,
        status,
        Number(spots_left),
        Number(total_spots),
        our_work_ref,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.error(
      "Error inserting event into DB, using in-memory:",
      error.message,
    );
    const newEvent = {
      id: "evt-" + Date.now(),
      title,
      title_english,
      date_str,
      date_english,
      time_str,
      time_english,
      location,
      location_english,
      description,
      full_details,
      full_details_english,
      image,
      category,
      category_english,
      status,
      spots_left: Number(spots_left),
      total_spots: Number(total_spots),
      our_work_ref,
      created_at: new Date(),
    };
    inMemoryEvents.unshift(newEvent);
    return newEvent;
  }
};

export const updateEvent = async (id, eventData) => {
  if (!isDbConnected) {
    const index = inMemoryEvents.findIndex((e) => String(e.id) === String(id));
    if (index !== -1) {
      inMemoryEvents[index] = { ...inMemoryEvents[index], ...eventData };
      return inMemoryEvents[index];
    }
    return null;
  }

  try {
    // Build dynamic UPDATE query
    const fields = [];
    const values = [];
    let paramIdx = 1;

    for (const [key, val] of Object.entries(eventData)) {
      if (key !== "id") {
        fields.push(`${key} = $${paramIdx}`);
        values.push(val);
        paramIdx++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = $${paramIdx} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating event in DB:", error.message);
    const index = inMemoryEvents.findIndex((e) => String(e.id) === String(id));
    if (index !== -1) {
      inMemoryEvents[index] = { ...inMemoryEvents[index], ...eventData };
      return inMemoryEvents[index];
    }
    return null;
  }
};

export const deleteEvent = async (id) => {
  if (!isDbConnected) {
    inMemoryEvents = inMemoryEvents.filter((e) => String(e.id) !== String(id));
    return true;
  }
  try {
    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    return true;
  } catch (error) {
    console.error("Error deleting event from DB:", error.message);
    inMemoryEvents = inMemoryEvents.filter((e) => String(e.id) !== String(id));
    return true;
  }
};
