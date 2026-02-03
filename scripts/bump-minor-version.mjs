import fs from "fs";
import path from "path";

const appJsonPath = path.join(process.cwd(), "app.json");

// Read app.json
const raw = fs.readFileSync(appJsonPath, "utf8");
const app = JSON.parse(raw);

// Parse version
let [major, minor, patch] = app.expo.version.split(".").map(Number);

// Bump minor, reset patch
minor += 1;
patch = 0;

// Set new version
app.expo.version = `${major}.${minor}.${patch}`;

// Write back
fs.writeFileSync(appJsonPath, JSON.stringify(app, null, 2));

console.log(`✅ Version updated to ${app.expo.version}`);
