-- Domain configuration and Demo data initialization
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_files (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    data BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    raised_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (title, target_amount, raised_amount) VALUES
('Zero Hunger Lunches', 50000.00, 21000.00),
('Bright Minds Textbooks', 35000.00, 15000.00),
('Mobile Pediatric Units', 120000.00, 45000.00),
('Solar School Community Hubs', 80000.00, 32000.00)
ON CONFLICT DO NOTHING;

