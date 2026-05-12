# Month Spread — PWA Setup

A step-by-step to get your spreadsheet running as an installable app on iOS.

The order matters: you need a hosted URL (step 2) before you can finish the Google sign-in setup (step 1), because Google needs to know which domain to trust. Read everything once before you start.

---

## 1. Create a Google OAuth Client ID

This lets the app sign in to your Google account and read your sheet. It's a one-time setup, free, and doesn't require a billing account.

### 1a. Create a Google Cloud project

1. Go to **https://console.cloud.google.com/**.
2. Sign in with the same Google account that owns the Month Spread sheet (`lwhittaker@gmail.com`).
3. Top-left, click the project dropdown → **New Project**.
4. Name it something like `Month Spread`. Leave Organization as "No organization". Click **Create**.
5. Wait ~10 seconds, then make sure the project dropdown is showing the new project.

### 1b. Enable the Google Sheets API

1. In the left sidebar, go to **APIs & Services → Library** (or visit `https://console.cloud.google.com/apis/library`).
2. Search for "Google Sheets API". Click it. Click **Enable**.

### 1c. Configure the OAuth consent screen

1. Sidebar → **APIs & Services → OAuth consent screen**.
2. Choose **External** (you have a personal Google account, not Workspace). Click **Create**.
3. Fill in:
   - **App name**: `Month Spread`
   - **User support email**: your email
   - **Developer contact**: your email
   Leave everything else empty. Click **Save and Continue**.
4. **Scopes** screen — click **Save and Continue** without adding any (you'll request scopes from JavaScript instead).
5. **Test users** screen — click **+ Add Users**, add your own Google email, then **Save and Continue**.
6. Click **Back to Dashboard**. You don't need to publish the app — keeping it in "Testing" mode is fine for personal use, and the only restriction is that test users have to re-consent every 7 days. You can later click **Publish App** to remove that, but Google may ask for verification depending on scopes.

### 1d. Create the OAuth Client ID

1. Sidebar → **APIs & Services → Credentials**.
2. Click **+ Create Credentials → OAuth client ID**.
3. **Application type**: `Web application`.
4. **Name**: `Month Spread PWA`.
5. **Authorized JavaScript origins**: this is the URL where you'll host the app. You need to come back here once you know that (step 2). For now you can put a placeholder like `https://example.com` and edit it later.
6. **Authorized redirect URIs**: leave empty — the app uses the implicit/popup flow, not redirects.
7. Click **Create**.
8. A dialog shows the **Client ID** (looks like `123456789-abcdef0123.apps.googleusercontent.com`). Copy it — you'll paste it into the app in step 3.

---

## 2. Host the files

The app needs to be served over **HTTPS** from a stable URL. iOS only allows "Add to Home Screen" / PWA install from HTTPS pages. Most free static hosts give you HTTPS automatically.

Whatever host you use, upload all of these files at the root of the site:

```
index.html
manifest.json
service-worker.js
icon-192.png
icon-512.png
icon-512-maskable.png
apple-touch-icon.png
favicon.png
```

Note your final URL (e.g. `https://yourname.github.io/month-spread/` or `https://month-spread.netlify.app/`). You'll need it in the next step.

**Important**: go back to **Google Cloud Console → Credentials → your OAuth Client → Authorized JavaScript origins**, edit it, and paste in the exact origin of your host (e.g. `https://yourname.github.io`). Save. Wait a minute — changes can take ~30 seconds to propagate.

---

## 3. Plug in the Client ID

Two options.

**Option A — through the UI (recommended).** Open the hosted page in any browser. Tap **Configure** (or the ⚙ in the top right after sign-in). Paste your **Client ID** into the first field. The **Sheet File ID** field is pre-filled with your current sheet (`1kMyQoPLnKHq6nTMpVjpM5RbyHlt495DIWmIk1wpnUXw`); leave it alone unless you switch to a different sheet. Tap **Save**. Sign in with Google.

**Option B — bake it into the file.** Open `index.html` in a text editor. Find this line near the top of the `<script>` block:

```javascript
const DEFAULT_CLIENT_ID = '';
```

Paste your Client ID between the quotes. Re-upload `index.html`. Now anyone opening the page sees a Sign-in button without having to configure first.

---

## 4. Install to your iPhone home screen

1. Open the URL in **Safari** on your iPhone. (Other iOS browsers don't support PWA install.)
2. Tap **Sign in with Google** and approve the consent screen. The first time Google will warn that the app is "unverified" because your OAuth consent screen is in Testing mode — tap **Advanced → Continue**.
3. Once the data loads, tap the **Share** button (square with up-arrow) → scroll down → **Add to Home Screen**.
4. Name it "Month Spread" if it isn't already. Tap **Add**.
5. The app icon appears on your home screen. Open it — it launches full-screen without Safari's UI, just like a native app.

---

## Troubleshooting

**"Sign in with Google" does nothing.**
Check the browser console (Safari → Develop → your iPhone). Most likely the JavaScript origin doesn't match — go back to step 2 and confirm the URL in Google Cloud Console matches exactly (no trailing slash differences, http vs https, etc.).

**"This app isn't verified" warning.**
Expected while the OAuth consent screen is in Testing mode. Click **Advanced → Continue** — you're the developer trusting your own app.

**"Access blocked: This app's request is invalid."**
Almost always a mismatch between the JavaScript origin in Cloud Console and the actual URL you're loading from. Double-check spelling and protocol.

**Spreadsheet won't load after sign-in.**
Make sure the Google account you signed in with has access to the sheet. The default Sheet ID points at the spreadsheet you used in Cowork — if that's owned by a different account, change the Sheet File ID in Settings, or share the sheet with the signing-in account.

**Session expires too often.**
That's an OAuth limitation for browser-only apps — access tokens last about 1 hour. The app tries silent refresh; if it can't, you'll see the sign-in screen again. While the consent screen is in Testing mode, Google additionally re-prompts every 7 days. Publishing the consent screen (clicking **Publish App** on the consent screen, then optionally going through verification) makes the 7-day re-prompt go away.

---

## What gets stored where

- **Your Google access token**: localStorage, expires after ~1 hour. Cleared when you sign out or the app sees a 401.
- **Your Settings (Client ID, Sheet File ID)**: localStorage.
- **Your "Amount Left" and target date per month**: localStorage, keyed by month label.
- **Everything else**: fetched fresh from Google Sheets on each open or Reload.

Nothing leaves your phone except direct calls to `sheets.googleapis.com`.
