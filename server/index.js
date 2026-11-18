const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const FILE = path.join(__dirname, "..", "data", "db.json");

const NAMES = ["Aarav","Ananya","Kabir","Diya","Rohan","Meera","Arjun","Isha","Vihaan","Kiara",
  "Aditya","Naina","Reyansh","Saanvi","Dev","Tara","Kunal","Riya","Yash","Anvi",
  "Neil","Pooja","Karan","Sneha","Ishaan","Mahi","Veer","Zoya","Aryan","Pihu","Sahil","Myra"];
const PLACES = ["IIT Delhi","DU North Campus","GGSIPU","Delhi Technological University",
  "Jamia Millia Islamia","Gurgaon","Noida","Pitampura, Delhi"];
const BIOS = ["Chai over coffee, always.","Weekend trekker, weekday coder.","Will beat you at FIFA.",
  "Looking for someone to share fries with.","Bad at replying, great at memes.","Dog person. Sorry, cat people.",
  "Fueled by Maggi and deadlines.","Ask me about my playlist."];
const INTERESTS = ["Music","Travel","Cricket","Movies","Coding","Photography","Anime","Gym",
  "Books","Cooking","Gaming","Art","Dance","Football","Trekking"];

const pick = (arr, i, n) => Array.from({ length: n }, (_, k) => arr[(i * 3 + k * 4) % arr.length]);

function seed() {
  const profiles = NAMES.map((name, i) => ({
    id: i + 1,
    name,
    age: 20 + (i % 9),
    photo: `https://i.pravatar.cc/500?img=${i + 1}`,
    bio: BIOS[i % BIOS.length],
    place: PLACES[i % PLACES.length],
    interests: pick(INTERESTS, i, 3),
    likedMe: i % 3 === 0, // in profiles ne pehle se user ko like kiya hai
  }));
  return { profiles, swipes: [], matches: [] };
}

function readDb() {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
const writeDb = (db) => fs.writeFileSync(FILE, JSON.stringify(db, null, 2));

// likedMe kabhi client ko nahi jaata
const publicProfile = ({ likedMe, ...rest }) => rest;

// GET /feed : jin profiles pe abhi swipe nahi hua
app.get("/feed", (req, res) => {
  const db = readDb();
  const swiped = new Set(db.swipes.map((s) => s.profileId));
  res.json({ profiles: db.profiles.filter((p) => !swiped.has(p.id)).map(publicProfile) });
});

// POST /swipe : like ya pass record karo, match hua to batao
app.post("/swipe", (req, res) => {
  const { profileId, direction } = req.body;
  if (!["like", "pass"].includes(direction)) {
    return res.status(400).json({ error: "Invalid direction" });
  }

  const db = readDb();
  const profile = db.profiles.find((p) => p.id === profileId);
  if (!profile) return res.status(404).json({ error: "Not found" });
  if (db.swipes.some((s) => s.profileId === profileId)) {
    return res.status(409).json({ error: "Already swiped" });
  }

  db.swipes.push({ profileId, direction, at: Date.now() });

  // match tabhi jab dono ne like kiya ho
  const isMatch = direction === "like" && profile.likedMe === true;
  if (isMatch) db.matches.push({ profileId, at: Date.now() });

  writeDb(db);
  res.json({ match: isMatch, profile: isMatch ? publicProfile(profile) : undefined });
});

// GET /matches : sirf mutual matches
app.get("/matches", (req, res) => {
  const db = readDb();
  const matches = db.matches
    .map((m) => ({
      ...publicProfile(db.profiles.find((p) => p.id === m.profileId)),
      matchedAt: m.at,
    }))
    .sort((a, b) => b.matchedAt - a.matchedAt);
  res.json({ matches });
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));