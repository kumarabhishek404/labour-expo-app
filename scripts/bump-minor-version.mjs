import fs from "fs";
import app from "../app.json";

let [major, minor, patch] = app.expo.version.split(".");

minor = Number(minor) + 1;
patch = 0;

app.expo.version = `${major}.${minor}.${patch}`;
fs.writeFileSync("app.json", JSON.stringify(app, null, 2));
