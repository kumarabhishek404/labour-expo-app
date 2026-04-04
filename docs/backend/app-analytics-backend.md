# App analytics — frontend contract and backend (MongoDB) implementation

## Troubleshooting: `Cannot POST /api/v1/analytics/events/batch`

That HTML response is Express (or similar) saying **no route is registered** for that URL. The app builds the URL as:

`{EXPO_PUBLIC_BASE_URL}` + `{path}`

With `EXPO_PUBLIC_BASE_URL=http://192.168.31.61:4000/api/v1`, the default path is `/analytics/events/batch`, so the full URL is:

`http://192.168.31.61:4000/api/v1/analytics/events/batch`

**Fix on the server:** register `POST /analytics/events/batch` on the same router that is mounted at `/api/v1` (see [Minimal stub (returns 200)](#minimal-stub-returns-200) below to unblock the app quickly).

**Optional app env:**

- `EXPO_PUBLIC_ANALYTICS_BATCH_PATH` — if your route differs (e.g. `/tracking/batch`), set this (must start with `/`).
- `EXPO_PUBLIC_ANALYTICS_DISABLED=true` — turns off analytics HTTP calls until the backend exists.

---

## Where data lives

| Layer | Role |
|--------|------|
| **React Native app** | Holds events in **RAM only** (short queue), then `POST`s JSON to your API. **No** AsyncStorage, SecureStore, or sessionStorage for analytics. |
| **Your API + MongoDB** | **Source of truth.** Validate the body, expand each batch into documents, `insertMany` into a collection (e.g. `app_events`). |

The `sessionId` field is only a **correlation id** generated per app process; it is **not** browser session storage — it is sent inside the JSON body so you can group events in MongoDB.

---

## Minimal stub (returns 200)

Add this on your API (same place other `/api/v1/...` routes live) so the app stops getting 404 while you implement MongoDB:

```javascript
// Mounted under /api/v1 — full path: POST /api/v1/analytics/events/batch
router.post("/analytics/events/batch", (req, res) => {
  const n = Array.isArray(req.body?.events) ? req.body.events.length : 0;
  return res.status(200).json({ ok: true, inserted: n });
});
```

Then replace the handler with the real `insertMany` implementation from this doc.

---

## HTTP API

### `POST /analytics/events/batch`

- **URL:** `{EXPO_PUBLIC_BASE_URL}/analytics/events/batch` (no `/api` prefix unless you change `app/api/analytics.tsx`).
- **Headers:** `Content-Type: application/json`  
  Optional: `Authorization: Bearer <jwt>` — if valid, attach `userId` to each stored document; if missing, store `userId: null`.

### Request body (full shape from the app)

```json
{
  "sessionId": "m1abc123-xyz",
  "platform": "android",
  "appVersion": "1.2.5",
  "osVersion": "14",
  "deviceModel": "Pixel 7",
  "deviceManufacturer": "Google",
  "isPhysicalDevice": true,
  "locale": "hi-IN",
  "timezone": "Asia/Kolkata",
  "nativeBuildVersion": "42",
  "expoRuntimeVersion": "1.0.0",
  "appName": "labour-app",
  "batchSentAt": "2026-04-03T12:00:00.000Z",
  "events": [
    {
      "name": "service_view",
      "properties": { "serviceId": "507f1f77bcf86cd799439011" },
      "clientTimestamp": "2026-04-03T11:59:58.000Z"
    }
  ]
}
```

Optional fields may be `null` or omitted on older app versions — treat as nullable.

### Success

- `200` or `204` with optional `{ "ok": true, "inserted": 5 }`.

### Errors

- `400` — malformed body, empty `events`, missing `sessionId`.
- Prefer **not** requiring auth for this route (or return `200` and skip insert if you must reject). The app calls this via **`API_CLIENT.makePostRequest`** (same as other APIs). If the server returns **401**, the global axios interceptor may **log the user out** like any other failing authenticated request — avoid returning 401 for analytics when the token is merely optional.

---

## MongoDB collection: `app_events`

**One document per event** (recommended). Copy envelope fields onto each row so queries are simple.

### Document shape

```javascript
{
  _id: ObjectId,

  userId: ObjectId | null,          // from JWT; null if anonymous

  sessionId: String,
  platform: String,                 // "ios" | "android" | "web"
  appVersion: String | null,
  osVersion: String | null,
  deviceModel: String | null,
  deviceManufacturer: String | null,
  isPhysicalDevice: Boolean | null,
  locale: String | null,
  timezone: String | null,
  nativeBuildVersion: String | null,
  expoRuntimeVersion: String | null,
  appName: String | null,

  eventName: String,                // e.g. "service_view"
  properties: Object,               // default {}

  clientTimestamp: Date,            // from event.clientTimestamp
  batchSentAt: Date,                // from body.batchSentAt
  serverTimestamp: Date,            // new Date() on insert

  ip: String | null,
  userAgent: String | null
}
```

### Indexes

```javascript
db.app_events.createIndex({ serverTimestamp: -1 });
db.app_events.createIndex({ eventName: 1, serverTimestamp: -1 });
db.app_events.createIndex({ userId: 1, serverTimestamp: -1 });
db.app_events.createIndex({ sessionId: 1, serverTimestamp: -1 });
db.app_events.createIndex({ "properties.serviceId": 1, eventName: 1 });
```

---

## Backend implementation (Node.js + Express + Mongoose)

Adjust paths and auth middleware to your project.

### 1) Mongoose model — `models/AppEvent.js`

```javascript
const mongoose = require("mongoose");

const AppEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    sessionId: { type: String, required: true, index: true },
    platform: { type: String, enum: ["ios", "android", "web"] },
    appVersion: String,
    osVersion: String,
    deviceModel: String,
    deviceManufacturer: String,
    isPhysicalDevice: Boolean,
    locale: String,
    timezone: String,
    nativeBuildVersion: String,
    expoRuntimeVersion: String,
    appName: String,

    eventName: { type: String, required: true, index: true },
    properties: { type: Object, default: {} },

    clientTimestamp: { type: Date, required: true },
    batchSentAt: { type: Date },
    serverTimestamp: { type: Date, default: Date.now, index: true },

    ip: String,
    userAgent: String,
  },
  { collection: "app_events" },
);

module.exports = mongoose.model("AppEvent", AppEventSchema);
```

### 2) Controller — `controllers/analyticsController.js`

```javascript
const AppEvent = require("../models/AppEvent");

function parseUserId(req) {
  if (req.user && req.user._id) return req.user._id;
  if (req.user && req.user.id) return req.user.id;
  return null;
}

exports.postBatch = async (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.sessionId || !Array.isArray(body.events) || body.events.length === 0) {
      return res.status(400).json({ message: "Invalid batch payload" });
    }

    const userId = parseUserId(req);
    const now = new Date();
    const ip = req.ip || req.headers["x-forwarded-for"] || null;
    const userAgent = req.headers["user-agent"] || null;

    const docs = body.events.map((ev) => ({
      userId,
      sessionId: body.sessionId,
      platform: body.platform,
      appVersion: body.appVersion ?? null,
      osVersion: body.osVersion ?? null,
      deviceModel: body.deviceModel ?? null,
      deviceManufacturer: body.deviceManufacturer ?? null,
      isPhysicalDevice: body.isPhysicalDevice ?? null,
      locale: body.locale ?? null,
      timezone: body.timezone ?? null,
      nativeBuildVersion: body.nativeBuildVersion ?? null,
      expoRuntimeVersion: body.expoRuntimeVersion ?? null,
      appName: body.appName ?? null,

      eventName: ev.name,
      properties: ev.properties && typeof ev.properties === "object" ? ev.properties : {},

      clientTimestamp: new Date(ev.clientTimestamp),
      batchSentAt: body.batchSentAt ? new Date(body.batchSentAt) : null,
      serverTimestamp: now,

      ip,
      userAgent,
    }));

    await AppEvent.insertMany(docs, { ordered: false });

    return res.status(200).json({ ok: true, inserted: docs.length });
  } catch (err) {
    console.error("[analytics] postBatch", err);
    return res.status(500).json({ message: "Server error" });
  }
};
```

### 3) Route — `routes/analytics.js`

```javascript
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const optionalAuth = require("../middleware/optionalAuth"); // attach req.user if token valid; else next()

router.post("/events/batch", optionalAuth, analyticsController.postBatch);

module.exports = router;
```

Mount in `app.js`:

```javascript
const analyticsRoutes = require("./routes/analytics");
app.use("/analytics", analyticsRoutes);
```

### 4) Optional auth middleware sketch — `middleware/optionalAuth.js`

```javascript
const jwt = require("jsonwebtoken");
// const User = require("../models/User");

module.exports = async function optionalAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }
  try {
    const token = auth.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = await User.findById(decoded.sub).lean();
    req.user = { _id: decoded.sub };
  } catch {
    req.user = null;
  }
  next();
};
```

---

## Event names (from app)

See `utils/analyticsEvents.ts` in the repo. Examples: `session_start`, `service_view`, `profile_view`, `service_apply_success`, `call_tap`, etc.

---

## Device metadata on every API request (not only analytics)

The shared axios client (`app/api/index.tsx`) adds **`X-Client-*` headers** to **all** outgoing requests (GET/POST/PATCH/DELETE, including `multipart/form-data`). Values come from `utils/clientDeviceInfo.ts` (`getClientDeviceHeaders()`).

| Header | Example | Notes |
|--------|---------|--------|
| `X-Client-Platform` | `android` | `ios` \| `android` \| `web` |
| `X-Client-App-Version` | `1.2.5` | Omitted if unknown |
| `X-Client-OS-Version` | `14` | |
| `X-Client-Device-Model` | `Pixel 7` | |
| `X-Client-Device-Manufacturer` | `Google` | |
| `X-Client-Physical-Device` | `1` or `0` | `1` = physical device |
| `X-Client-Locale` | `hi-IN` | |
| `X-Client-Timezone` | `Asia/Kolkata` | |
| `X-Client-Native-Build` | build string | |
| `X-Client-Expo-Runtime-Version` | string or JSON policy | Always sent (may be `""`) |
| `X-Client-App-Name` | from Expo config | |

Your backend can read these in middleware and attach to logs or persist on request records. Analytics batch bodies duplicate the same device fields (plus `sessionId`) for event storage.

---

## Privacy

- Do **not** store phone numbers, emails, or full names in `properties`.
- `call_tap` should only include ids and `source` labels.
