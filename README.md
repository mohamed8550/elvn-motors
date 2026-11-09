# ELVN Motors

Responsive English / Arabic showroom website. Static HTML, CSS and JavaScript. No build tools or backend required.

## Preview

Run `python -m http.server 8080` in this folder and open http://localhost:8080. Serve over HTTP so the inventory JSON can load.

## GitHub Pages

Push these files to your GitHub repository on the `main` branch. In Settings → Pages, select **GitHub Actions** as the source. The included workflow publishes the site. Relative asset paths support both repository URLs and a custom domain.

After the deployment works, set `elvnmotors.com` under Settings → Pages → Custom domain and follow GitHub’s displayed DNS instructions in IONOS. Enable HTTPS when available. No DNS or account settings have been changed by this project.

## Cars

`data/cars.json` currently contains an empty list. Until real inventory is supplied, visitors see a WhatsApp enquiry section. Add approved inventory in this format:

```json
[
  {
    "title": "Brand Model · Year",
    "details": "Approved specifications and price",
    "detailsAr": "المواصفات والسعر المعتمد",
    "image": "assets/car-photo.jpg",
    "available": true
  }
]
```

Use your own car photographs and verified descriptions. Set `available` to `false` to hide a car. A future control panel can replace the JSON source with an API without redesigning the site. A secure panel will need authentication and a backend; it is not included in this version.

## Assets and contact

- The logo and showroom branding photograph were supplied by ELVN Motors.
- All car photographs were supplied by ELVN Motors. The C180 gallery showcases showroom photography; it does not assert current stock, model year, price or specifications.
- Fonts load from Google Fonts; system fonts are used as fallback.
- Contact: +20 111 059 6555.
- Facebook: https://www.facebook.com/elvnmotors
- Instagram: https://www.instagram.com/elvn_motors/
- TikTok: https://www.tiktok.com/@elvn.motors

Confirm address details with the company before launch. The location graphic is decorative; the direction links open the supplied Google Maps place.
