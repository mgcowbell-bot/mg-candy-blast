# Publishing MG Candy Blast on GitHub

## 1. Create the repository
1. Sign in at https://github.com and click **New repository**.
2. Name it, for example, `mg-candy-blast`. Keep it **Public** (free GitHub Pages needs a public repo on free accounts).
3. Do **not** tick "Add a README" (this project already has one).

## 2. Upload the project
**Without git (easiest):** unzip the project, open the new repository page, click **uploading an existing file**, drag the *contents* of the folder (including the hidden `.github` folder) and commit to `main`.
If the website refuses to take `.github`, use git instead:

```
cd MG-Candy-Blast
git init
git add .
git commit -m "MG Candy Blast 2.0"
git branch -M main
git remote add origin https://github.com/<your-name>/mg-candy-blast.git
git push -u origin main
```

## 3. Turn on GitHub Pages
Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Push (or open **Actions → Deploy to GitHub Pages → Run workflow**). After about a minute your game is at
`https://<your-name>.github.io/mg-candy-blast/`.

## 4. Check it works
- Open the link on your phone in Chrome. After the first load the game works offline (service worker).
- Chrome menu → **Add to Home screen** installs it like an app.
- If you change files later, bump `const CACHE='mgcb-v…'` in `service-worker.js` so phones fetch the new version.

## 5. Optional extras
- **Custom domain**: Settings → Pages → Custom domain.
- **Releases**: Releases → *Draft a new release* → attach `MG-Candy-Blast-single.html` (`node tools/build-single.js`).
- **Android app**: this is a web app, not an APK. To publish on Google Play, wrap the hosted game with **Bubblewrap** (Trusted Web Activity) or **Capacitor**; you need your own Google Play developer account (Google charges a one-time fee). Nothing in this repository claims the game is already on Google Play.
- **Privacy policy**: [PRIVACY.md](../PRIVACY.md) explains that data stays on the device; stores usually require a public policy URL — you can link to that file on GitHub.

## Things to review before publishing
- The artwork `assets/images/home.jpg` — make sure you own or are licensed to publish it.
- The contact details in the About screen.
- The licence (`LICENSE`) — change it if you do not want the code to be open source.
