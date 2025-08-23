const pool = require("../config/db");

const User = ({
    create: async ({username, email, password, status}) => {
        const query = `INSERT INTO USERS (username, email, password, status) VALUES ($1, $2, $3, $4) RETURNING *;`;
        const values = [username, email, password, status || "admin"];
        const result = await pool.query(query, values);

        return result.rows[0];
    },

    findByEmail: async (email) => {
        const query = `SELECT * FROM users WHERE email = $1;`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }
})

module.exports = User;