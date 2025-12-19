import express from 'express';
import pool from './db.js';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    return res.send('Welcome to Rakuen.');
});

app.get('/users', async (_req, res) => {
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

app.post('/users', async (req, res) => {
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

app.patch('/users', async (req, res) => {
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

app.delete('/users', async (req, res) => {
    const name = typeof req.query.name === 'string' ? req.query.name : '';
    const email = typeof req.query.email === 'string' ? req.query.email : '';

    const queryPair: {
        query: string,
        values: (string | number)[]
    } = {
        query: '',
        values: []
    };
    let deleteObj: string = '';

    if (!name && !email) {  // invalid name and invalid email: error
        return res.status(400).json({
            error: `Name and email are both empty or invalid.`,
            name: name,
            email: email
        });
    } else if (email && name) {  // check both name and email on db
        queryPair.query = 
            `
            DELETE FROM users
            WHERE email = $1 AND name = $2
            RETURNING *
            `;
        queryPair.values.push(email, name);
        deleteObj = `email-name pair {${name}, ${email}}`;
    } else if (email) {  // delete entry that match the email
        queryPair.query = 
            `
            DELETE FROM users
            WHERE email = $1
            RETURNING *
            `;
        queryPair.values.push(email);
        deleteObj = `email ${email}`;
    } else {  // delete entry that match the name
        queryPair.query = 
            `
            DELETE FROM users
            WHERE name = $1
            RETURNING *
            `;
        queryPair.values.push(name);
        deleteObj = `name ${name}`;
    }
    
    try {
        const result = await pool.query(
            queryPair.query,
            queryPair.values
        );
        if (result.rowCount === 0) {
            return res.status(404).json({
                error: `Provided ${deleteObj} not found in database, delete failed.`
            });
        } else {
            const user = result.rows;

            return res.status(200).json({
                message: `User with ${deleteObj} deleted!`,
                ...user,
            });
        }
    } catch (err) {
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
