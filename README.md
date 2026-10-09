# RIVA website — GitHub Pages ready

Plain HTML/CSS/JS. No build step, no folder paths to maintain.

```
index.html          the page
css/styles.css      all styling (responsive for phone → large desktop)
js/config.js        products, prices, coupons, courier charge  ← the file you edit
js/assets.js        finds your pictures/videos by FILE NAME (no paths needed)
js/app.js, chat.js  the shop and the chat helper
assets/             your pictures and video
favicon.png, apple-touch-icon.png   browser/phone icons (replace to change)
.github/workflows/deploy.yml        publishes the site on every upload
```

## 1. Publish
1. Create a GitHub repository and upload **everything** in this folder (drag the files and folders into *Add file → Upload files*).
   If `.github` doesn't upload, use *Add file → Create new file*, type `.github/workflows/deploy.yml` as the name, and paste the contents of that file.
2. **Settings → Pages → Build and deployment → Source: _GitHub Actions_.**
3. Wait about a minute (Actions tab). Your site is at `https://<username>.github.io/<repository>/`.

*No Actions?* Choose **Source: Deploy from a branch → main / (root)** instead. That works too — just keep new pictures in the `assets/` folder (see "Simple mode" below).

## 2. Add or replace pictures — no paths, no code
Upload a file with the right **name**. The extension can be `.webp .jpg .jpeg .png .avif .gif .svg`. Capitals and spaces are fine in Actions mode.

| Picture | File name |
|---|---|
| Product photos | `<product-id>.jpg`, `<product-id>-2.jpg`, `<product-id>-3.jpg` … e.g. `rose-fresh-4.jpg` |
| Home hero photo | `hero.webp` |
| About / Our Story photo | `about.jpg` |
| Navbar logo / leaf mark / footer logo / big hero wordmark / logo tile | `logo.png` / `logo-mark.png` / `logo-footer.png` / `logo-hero.png` / `logo-lockup.webp` |
| Home video (+ cover frame) | `video.mp4` (+ `video-poster.jpg`) |
| Browser tab icon | `favicon.png`, `apple-touch-icon.png` (in the main folder) |

* **Any folder works** (Actions mode): upload to the repository root, `assets/`, or anywhere else. The site finds it by name.
* **Replace** a picture by uploading the same name and extension. If you change the extension, delete the old file (the order of preference is webp, avif, jpg, jpeg, png, gif, svg).
* **Simple mode** (branch deploy): files must be inside `assets/`, named in lowercase with hyphens, and product photos numbered with no gaps (`-2`, `-3`, `-4` …).
* A missing picture never breaks the page — a placeholder or nothing is shown.

## 3. Add a product
In `js/config.js`, copy one product block, give it a new `id` (e.g. `"mint-fresh"`), and upload `mint-fresh.jpg`, `mint-fresh-2.jpg`… Done.

## 4. Change prices, coupon, courier charge
Top of `js/config.js`: `SHIPPING = 250`, `COUPONS = { INSTA: 15 }` (code → % off).

## 5. Preview on your computer
Double-click `index.html` (works without a server), or run `python3 -m http.server` in this folder and open http://localhost:8000.

## Good to know
* Page links look like `…/#/shop` — this is deliberate: it works on GitHub Pages without any server setup and survives refresh and sharing.
* For speed keep photos around 1600 px wide and under ~300 KB (WebP or JPG), and the video under ~5 MB.
* Checkout is a demo — no payment is taken and no order is sent anywhere yet.
