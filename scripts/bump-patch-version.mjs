import fs from "fs";
import app from "../app.json";

let [major, minor, patch] = app.expo.version.split(".");

patch = Number(patch) + 1;
app.expo.version = `${major}.${minor}.${patch}`;

fs.writeFileSync("app.json", JSON.stringify(app, null, 2));
