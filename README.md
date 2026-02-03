
# 📱 Expo React Native Project – Command Line Reference Guide

This document lists **all important Expo, EAS, OTA, Play Store, and GitHub-related commands** used in this project, along with their purpose.

---

## 1️⃣ Project Setup & Local Development

### Install Expo CLI
```bash
npm install -g expo-cli
```

### Install EAS CLI (Required)
```bash
npm install -g eas-cli
```

### Install dependencies
```bash
npm install
```

### Start development server
```bash
expo start
```

```bash
expo start --clear
expo start --android
expo start --ios
```

### Run app locally (Android)
```bash
expo run:android
```

---

## 2️⃣ Expo Configuration

### Diagnostics
```bash
expo diagnostics
```

### Prebuild native projects
```bash
expo prebuild
```

---

## 3️⃣ EAS Setup

### Initialize EAS
```bash
eas init
```

### Login
```bash
expo login
```

```bash
expo login --token <EXPO_TOKEN>
```

### Project info
```bash
eas project:info
```

---

## 4️⃣ EAS Build Commands

### Android production build
```bash
eas build --platform android --profile production
```

### Development build
```bash
eas build --platform android --profile development
```

### Build all platforms
```bash
eas build --platform all
```

### View builds
```bash
eas build:list
```

### View build details
```bash
eas build:view <build-id>
```

---

## 5️⃣ OTA Updates (Over-The-Air)

### Publish OTA (production)
```bash
eas update --branch production
```

### OTA with message
```bash
eas update --branch production --message "Fix update guard"
```

### OTA to staging
```bash
eas update --branch staging
```

### List updates
```bash
eas update:list
```

### View update
```bash
eas update:view <update-id>
```

### Rollback update
```bash
eas update --branch production --republish <old-update-id>
```

---

## 6️⃣ Google Play Store

### Submit Android build
```bash
eas submit -p android
```

### Submit specific build
```bash
eas submit -p android --id <build-id>
```

---

## 7️⃣ Versioning

```bash
npm version patch
npm version minor
npm version major
```

---

## 8️⃣ Debugging & Logs

### Android logs
```bash
adb logcat
```

### Filter Expo logs
```bash
adb logcat ReactNativeJS:V Expo:V *:S
```

---

## 9️⃣ Git Commands

```bash
git add .
git commit -m "Fix bug"
git push
```

### Tag release
```bash
git tag v1.2.0
git push origin v1.2.0
```

---

## 🔟 GitHub Actions (CI/CD)

### Build
```yaml
type: build
params:
  platform: android
  profile: production
```

### Submit
```yaml
type: submit
params:
  profile: production
```

---

## 1️⃣1️⃣ Build vs OTA

| Change | Action |
|------|--------|
| JS/UI | eas update |
| Native/config | eas build |
| Permissions | eas build |
| SDK upgrade | eas build |

---

## 1️⃣2️⃣ Recommended Flow

```bash
git push
eas build --platform android --profile production
eas submit -p android
eas update --branch production
```

---

## 🧠 Key Notes

- OTA ≠ Play Store update
- Submit does not rebuild
- Channel & runtimeVersion must match
