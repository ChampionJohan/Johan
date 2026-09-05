# RoamRate — iOS/Android wrapper (Capacitor)

Packages `../travel-ledger` (the web app) as an installable iOS/Android app via
[Capacitor](https://capacitorjs.com/). Requires a Mac + Xcode for iOS; Android Studio
(any OS) for Android.

Full step-by-step launch guide (Xcode signing, Apple Developer enrollment, App Store
Connect metadata): see the guide shared alongside this branch, or ask to have it
republished.

## Quick start (on a Mac, for iOS)

```
cd mobile
npm install
npx cap add ios       # generates ios/ — an actual Xcode project, macOS-only
npx cap open ios      # opens Xcode
```

In Xcode: select your Apple ID under **Signing & Capabilities**, plug in your iPhone,
hit Run. No paid account needed just to run it on your own device.

## Files here

```
mobile/
  package.json               Capacitor dependencies
  capacitor.config.json      appId com.roamrate.app, points webDir at ../travel-ledger
  app-store-icon-1024.png    1024x1024, no alpha — App Store marketing icon
  ios/, android/             generated locally by `npx cap add ...` (not committed until you run it)
```

## After editing the app

Whenever `travel-ledger/` changes, re-sync the native copy:

```
npx cap sync
```

Then rebuild in Xcode/Android Studio.
