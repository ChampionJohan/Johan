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

## Voice input (quick-add microphone button)

The quick-add field's 🎤 button uses `@capacitor-community/speech-recognition`
so it works inside the wrapped app. This is required — the browser's own
Web Speech API is exposed inside iOS's WKWebView but does not actually work
there (a known WebKit limitation), so without this native plugin the mic
button would silently do nothing on iOS. It still falls back to the Web
Speech API automatically when the site is opened as a plain website/PWA in
Safari or Chrome instead of the wrapped app.

After `npm install` (already includes this plugin) and `npx cap sync`, add
two permission strings in Xcode — the plugin will not work without them and
Apple will reject the build without them:

1. Open the project in Xcode (`npx cap open ios`).
2. Select **App** in the left sidebar → the **App** target → the **Info** tab.
3. Add two rows (hover any row, click **+**):
   - Key `Privacy - Speech Recognition Usage Description` → value: a short
     reason, e.g. "To add expenses by voice."
   - Key `Privacy - Microphone Usage Description` → value: e.g. "To hear
     what you say when adding an expense by voice."
4. Rebuild and run (▶). The first tap of 🎤 will prompt for microphone and
   speech-recognition permission.
