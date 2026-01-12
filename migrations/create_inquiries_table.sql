-- Create inquiries table for quotation form data
-- This table stores customer inquiries/quotes from the website

CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    customer_no TEXT,
    project_type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

-- Create an index on created_at for sorting/filtering by date
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);

-- Optional: Add a comment to the table
COMMENT ON TABLE inquiries IS 'Stores customer quotation form submissions from the website';
