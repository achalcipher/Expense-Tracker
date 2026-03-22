// In-memory store — replaces MongoDB entirely
// Data lives in server RAM. Resets on server restart.

const users    = []; // { id, username, email, password(hashed), budgets }
const expenses = []; // { id, userId, amount, category, description, date, createdAt }

module.exports = { users, expenses };
