# Nohé — website

Plain HTML/CSS/JS. No build step: open `index.html` in a browser.

## Files
- `index.html`: page content and sections
- `css/style.css`: design. Brand colours and fonts are in `:root` at the top
- `js/products.js`: **the product catalogue**. Add, edit or remove products here
- `js/app.js`: cart, wishlist, filters, search, checkout
- `assets/`: logo, favicon, product photos (`assets/products/`)

## Common edits
- **Real logo:** save it as `assets/logo.png`, then in `index.html` replace
  `<span class="logo__word">…</span>` inside `<a class="logo">` with
  `<img src="assets/logo.png" alt="Nohé" class="logo__img">`
- **Product photos:** put them in `assets/products/` and set `image: "assets/products/name.jpg"` on the product
- **Prices / sizes / sold-out sizes:** edit them in `js/products.js`
- **Free-shipping threshold, shipping fee, discount codes:** top of `js/app.js`
- **Adding Men later:** add products with `gender: "men"`. The Men page reuses the same grid

## Before taking real orders
Checkout is a front-end demo for now. To accept payments, connect one of these:
- **Shopify** (easiest; this design can become a Shopify theme)
- **Razorpay** (UPI, cards and COD in India), or
- a backend such as Firebase or Supabase that stores orders.

The newsletter and "Notify me" forms also need connecting to a mailing tool such as Mailchimp or Klaviyo.

## Hosting (free)
Drag the folder onto Netlify Drop (app.netlify.com/drop), or use Vercel or GitHub Pages, then connect your domain.
