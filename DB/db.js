const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data.json");

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    }
  } catch (e) {
    console.error("Failed to load DB:", e.message);
  }
  return { users: [], posts: [], comments: [] };
}

function saveDB(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error("Failed to save DB:", e.message);
  }
}

// FIX #2: Safe ID generation that survives deletes
function nextId(arr) {
  if (arr.length === 0) return 1;
  return Math.max(...arr.map((x) => x.id)) + 1;
}

const db = loadDB();

module.exports = { db, saveDB, nextId };
