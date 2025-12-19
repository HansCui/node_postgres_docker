INSERT INTO users (name, email)
VALUES
    ('Alice Johnson', 'alice@example.com'),
    ('Bob Smith', 'bob@example.com'),
    ('Charlie Brown', 'charlie@example.com')
ON CONFLICT (email)
DO NOTHING;

-- ONLY ON dev/demo
-- DON'T AUTO-SEED prod unless you explicity want demo data.
