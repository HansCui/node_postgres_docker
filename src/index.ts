import express from 'express';
import pool from './db.js';

const app = express();
app.use(express.json());

app.get('/', async (_req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Database Error',
            stacktrace: err
        });
    }
});

app.post('/', async (req, res) => {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({
            error: "name or email missing."
        });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO users (name, email) VALUES
            ($1, $2)
            RETURNING *
            `,
            [name, email]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Database Error',
            stacktrace: err
        });
    }
});

app.patch('/', async (req, res) => {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
        return res.status(400).json({
            error: "name or email missing."
        });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO users (name, email)
            VALUES ($1, $2)
            ON CONFLICT (email)
            DO UPDATE SET name = EXCLUDED.name
            RETURNING *, (xmax = 0) AS inserted
            `,
            [name, email]
        );

        const user = result.rows[0];
        const statusCode = user.inserted ? 201 : 200;

        res.status(statusCode).json({
            message: user.inserted ? 'New user added!' : 'User patched!',
            ...user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Database Error',
            stacktrace: err
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
