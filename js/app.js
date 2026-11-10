/* =========================================================
   NOHÉ — Storefront logic
   Cart, wishlist, filters, quick view, search, checkout (demo)
   ========================================================= */
(() => {
  "use strict";

  const PRODUCTS = window.NOHE_PRODUCTS || [];
  const FREE_SHIP = 2999;
  const SHIP_FEE = 149;
  const PROMOS = { WELCOME10: 0.10, NOHE15: 0.15 };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------- Safe storage ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };

  let cart = store.get("nohe_cart", []);          // [{id, color, size, qty}]
  let wish = store.get("nohe_wish", []);          // [id]
  let promo = null;

  /* =========================================================
     Garment illustrations (placeholders until real photos)
     ========================================================= */
  function mix(hex, target, amt) {
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const a = p(hex), b = p(target);
    return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * amt).toString(16).padStart(2, "0")).join("");
  }
  const SHAPES = {
    dress: `<path d="M126 92 L130 140 M174 92 L170 140" stroke="C" stroke-width="3" fill="none"/>
      <path d="M118 140 Q150 156 182 140 L190 205 Q206 290 232 368 Q150 386 68 368 Q94 290 110 205 Z" fill="C"/>
      <path d="M110 205 Q150 218 190 205" stroke="D" stroke-width="2" fill="none"/>
      <path d="M150 220 Q146 300 132 372 M168 222 Q178 300 196 370" stroke="D" stroke-width="1.5" fill="none" opacity=".5"/>
      <path d="M124 150 Q130 190 122 240" stroke="L" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>`,
    top: `<path d="M116 96 L92 106 L58 196 L82 206 L108 152 L106 270 Q150 282 194 270 L192 152 L218 206 L242 196 L208 106 L184 96 Q150 118 116 96 Z" fill="C"/>
      <path d="M116 96 Q150 130 184 96" stroke="D" stroke-width="2" fill="none"/>
      <path d="M150 112 L150 270" stroke="D" stroke-width="1.5" opacity=".5"/>
      <circle cx="150" cy="140" r="3" fill="L"/><circle cx="150" cy="170" r="3" fill="L"/><circle cx="150" cy="200" r="3" fill="L"/><circle cx="150" cy="230" r="3" fill="L"/>
      <path d="M120 130 Q126 190 118 250" stroke="L" stroke-width="5" fill="none" opacity=".3" stroke-linecap="round"/>`,
    skirt: `<rect x="104" y="118" width="92" height="18" rx="2" fill="D"/>
      <path d="M104 136 L196 136 L238 342 Q150 362 62 342 Z" fill="C"/>
      <path d="M124 136 L104 348 M142 136 L134 354 M158 136 L166 354 M176 136 L196 348" stroke="D" stroke-width="1.5" opacity=".5"/>
      <path d="M116 150 L90 320" stroke="L" stroke-width="5" opacity=".3" stroke-linecap="round"/>`,
    trousers: `<rect x="106" y="96" width="88" height="16" rx="2" fill="D"/>
      <path d="M106 112 L194 112 L214 370 L162 370 L150 176 L138 370 L86 370 Z" fill="C"/>
      <path d="M128 112 L120 370 M172 112 L180 370" stroke="D" stroke-width="1.5" opacity=".45"/>
      <path d="M150 112 L150 176" stroke="D" stroke-width="1.5"/>
      <path d="M112 128 Q118 140 132 140" stroke="D" stroke-width="1.5" fill="none"/>
      <path d="M188 128 Q182 140 168 140" stroke="D" stroke-width="1.5" fill="none"/>`,
    coord: `<path d="M118 70 L98 78 L76 150 L94 156 L112 116 L112 182 Q150 190 188 182 L188 116 L206 156 L224 150 L202 78 L182 70 Q150 88 118 70 Z" fill="C"/>
      <path d="M118 70 Q150 96 182 70" stroke="D" stroke-width="2" fill="none"/>
      <path d="M150 84 L150 184" stroke="D" stroke-width="1.5" opacity=".5"/>
      <rect x="110" y="196" width="80" height="12" rx="2" fill="D"/>
      <path d="M110 208 L190 208 L204 372 L160 372 L150 250 L140 372 L96 372 Z" fill="C"/>
      <path d="M150 208 L150 250" stroke="D" stroke-width="1.5"/>
      <path d="M120 90 Q124 130 118 170" stroke="L" stroke-width="5" opacity=".3" stroke-linecap="round" fill="none"/>`,
    blazer: `<path d="M114 90 L80 106 L60 300 L88 304 L100 172 L102 336 L198 336 L200 172 L212 304 L240 300 L220 106 L186 90 L150 210 Z" fill="C"/>
      <path d="M114 90 L136 180 L150 210 M186 90 L164 180 L150 210" stroke="D" stroke-width="2" fill="none"/>
      <path d="M150 210 L150 336" stroke="D" stroke-width="1.5" opacity=".6"/>
      <circle cx="158" cy="240" r="4" fill="D"/>
      <path d="M112 270 L138 270 M162 270 L188 270" stroke="D" stroke-width="2"/>
      <path d="M104 120 Q110 200 106 300" stroke="L" stroke-width="5" opacity=".2" stroke-linecap="round" fill="none"/>`,
    kurta: `<path d="M118 92 L92 102 L66 226 L88 232 L106 158 L100 350 L200 350 L194 158 L212 232 L234 226 L208 102 L182 92 Q150 112 118 92 Z" fill="C"/>
      <path d="M140 98 L150 150 L160 98" stroke="D" stroke-width="2" fill="none"/>
      <path d="M100 330 L200 330" stroke="D" stroke-width="3" stroke-dasharray="2 6" opacity=".6"/>
      <path d="M108 300 L192 300" stroke="L" stroke-width="1.5" opacity=".5"/>
      <path d="M66 226 L88 232" stroke="L" stroke-width="3" opacity=".5"/>
      <path d="M120 130 Q126 230 116 330" stroke="L" stroke-width="5" opacity=".3" stroke-linecap="round" fill="none"/>`
  };
  const HANGER = `<path d="M150 58 q0-16 12-16 q12 0 12 12 q0 9-12 14 L150 74" stroke="#1f1c1a" stroke-width="2.4" fill="none" opacity=".55"/>
    <path d="M150 74 L88 98 L212 98 Z" stroke="#1f1c1a" stroke-width="2.4" fill="none" opacity=".55" stroke-linejoin="round"/>`;

  function art(type, color) {
    const shape = SHAPES[type] || SHAPES.dress;
    const bg = mix(color, "#f5efea", 0.72);
    const bg2 = mix(color, "#f5efea", 0.55);
    const D = mix(color, "#1f1c1a", 0.28);
    const L = mix(color, "#ffffff", 0.45);
    const g = "g" + Math.random().toString(36).slice(2, 8);
    const needsHanger = type !== "skirt" && type !== "trousers" && type !== "coord";
    return `<svg class="art" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><radialGradient id="${g}" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${bg2}"/></radialGradient></defs>
      <rect width="300" height="400" fill="url(#${g})"/>
      <ellipse cx="150" cy="384" rx="96" ry="9" fill="#1f1c1a" opacity=".07"/>
      ${needsHanger ? HANGER : ""}
      <g>${shape.replace(/"C"/g, `"${color}"`).replace(/"D"/g, `"${D}"`).replace(/"L"/g, `"${L}"`)}</g>
    </svg>`;
  }
  function media(p, colorHex) {
    if (p.image) return `<img class="photo" src="${p.image}" alt="${p.name}" loading="lazy">`;
    return art(p.art, colorHex || p.colors[0][1]);
  }
  function paintArt(root = document) {
    $$("[data-art]", root).forEach((el) => {
      if (el.dataset.painted) return;
      el.insertAdjacentHTML("afterbegin", art(el.dataset.art, el.dataset.color || "#c98b6f"));
      el.dataset.painted = "1";
    });
  }

  /* =========================================================
     Shop grid + filters
     ========================================================= */
  const state = { cat: "all", size: "all", sort: "featured", collection: null };
  const CATS = ["all", "new", ...new Set(PRODUCTS.map((p) => p.category))];
  const catLabel = (c) => (c === "all" ? "All" : c === "new" ? "New In" : c);

  function renderChips() {
    $("#catChips").innerHTML = CATS.map((c) =>
      `<button class="chip ${state.cat === c && !state.collection ? "active" : ""}" data-cat="${c}" role="tab">${catLabel(c)}</button>`
    ).join("") + (state.collection ? `<button class="chip active" data-cat="all">${state.collection} ✕</button>` : "");
  }

  function filtered() {
    let list = PRODUCTS.filter((p) => p.gender === "women");
    if (state.collection) list = list.filter((p) => p.collection === state.collection);
    if (state.cat === "new") list = list.filter((p) => p.isNew);
    else if (state.cat !== "all") list = list.filter((p) => p.category === state.cat);
    if (state.size !== "all") list = list.filter((p) => p.sizes.includes(state.size) && !p.soldOut.includes(state.size));
    const s = [...list];
    if (state.sort === "low") s.sort((a, b) => a.price - b.price);
    if (state.sort === "high") s.sort((a, b) => b.price - a.price);
    if (state.sort === "new") s.sort((a, b) => b.isNew - a.isNew);
    if (state.sort === "featured") s.sort((a, b) => b.bestseller - a.bestseller);
    return s;
  }

  function cardHTML(p) {
    const sale = p.compareAt && p.compareAt > p.price;
    const tags = [p.isNew && `<span class="tag">New</span>`, sale && `<span class="tag tag--sale">-${Math.round((1 - p.price / p.compareAt) * 100)}%</span>`, !p.isNew && !sale && p.bestseller && `<span class="tag">Bestseller</span>`].filter(Boolean).join("");
    return `<article class="card reveal" data-id="${p.id}">
      <div class="card__media" data-open="${p.id}">
        ${media(p)}
        <div class="card__tags">${tags}</div>
        <button class="icon-btn card__wish ${wish.includes(p.id) ? "active" : ""}" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">
          <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-9.2C1.6 7.4 4 4 7.4 4c2 0 3.4 1.1 4.6 2.7C13.2 5.1 14.6 4 16.6 4 20 4 22.4 7.4 21 10.8 19 15.6 12 20 12 20Z"/></svg>
        </button>
        <button class="card__quick" data-open="${p.id}">Quick view</button>
      </div>
      <div class="card__info">
        <div>
          <h3 class="card__name" data-open="${p.id}">${p.name}</h3>
          <div class="card__cat">${p.category}</div>
          <div class="card__swatches">${p.colors.map(([n, h]) => `<span class="swatch-dot" style="background:${h}" title="${n}"></span>`).join("")}</div>
        </div>
        <div class="card__price">${inr(p.price)}${sale ? `<s>${inr(p.compareAt)}</s>` : ""}</div>
      </div>
    </article>`;
  }

  function renderGrid() {
    const list = filtered();
    $("#productGrid").innerHTML = list.map(cardHTML).join("");
    $("#resultCount").textContent = list.length;
    $("#emptyState").hidden = list.length > 0;
    renderChips();
    observeReveal($("#productGrid"));
  }

  function setFilter(val) {
    state.collection = null;
    if (CATS.includes(val)) state.cat = val;
    else if (PRODUCTS.some((p) => p.collection === val)) { state.cat = "all"; state.collection = val; }
    else state.cat = "all";
    renderGrid();
  }

  /* =========================================================
     Product modal
     ========================================================= */
  let current = null; // {p, color, size, qty}

  function openProduct(id) {
    const p = byId(id);
    if (!p) return;
    current = { p, color: 0, size: null, qty: 1 };
    renderProduct();
    openModal("#productModal");
  }

  function renderProduct() {
    const { p, color, size } = current;
    const sale = p.compareAt && p.compareAt > p.price;
    const inWish = wish.includes(p.id);
    $("#productModalContent").innerHTML = `
      <div class="pdp">
        <div class="pdp__media">
          <div class="pdp__img" data-art-slot>${media(p, p.colors[color][1])}</div>
          ${p.image ? "" : `<div class="pdp__thumbs">${p.colors.map(([n, h], i) => `<button class="pdp__thumb ${i === color ? "active" : ""}" data-color-i="${i}" aria-label="${n}">${art(p.art, h)}</button>`).join("")}</div>`}
        </div>
        <div class="pdp__info">
          <div class="pdp__crumb">Women / ${p.category}${p.collection ? " / " + p.collection : ""}</div>
          <h2 class="pdp__name">${p.name}</h2>
          <div class="pdp__price">${inr(p.price)} ${sale ? `<s>${inr(p.compareAt)}</s>` : ""} <small>incl. of all taxes</small></div>
          <p class="pdp__desc">${p.description}</p>

          <div class="opt">
            <div class="opt__label">Colour <b>${p.colors[color][0]}</b></div>
            <div class="colors">${p.colors.map(([n, h], i) => `<button class="color-opt ${i === color ? "active" : ""}" style="background:${h}" data-color-i="${i}" aria-label="${n}" title="${n}"></button>`).join("")}</div>
          </div>

          <div class="opt">
            <div class="opt__label">Size <button class="link-btn" data-info="size">Size guide</button></div>
            <div class="sizes">${["XS", "S", "M", "L", "XL"].map((s) => {
              const ok = p.sizes.includes(s) && !p.soldOut.includes(s);
              return `<button class="size-opt ${size === s ? "active" : ""}" data-size="${s}" ${ok ? "" : "disabled"}>${s}</button>`;
            }).join("")}</div>
          </div>

          <div class="pdp__add">
            <button class="btn btn--dark" id="addToBag">Add to bag — ${inr(p.price)}</button>
            <button class="icon-btn ${inWish ? "active" : ""}" data-wish="${p.id}" aria-label="Wishlist">
              <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-9.2C1.6 7.4 4 4 7.4 4c2 0 3.4 1.1 4.6 2.7C13.2 5.1 14.6 4 16.6 4 20 4 22.4 7.4 21 10.8 19 15.6 12 20 12 20Z"/></svg>
            </button>
          </div>
          <p class="pdp__hint" id="pdpHint"></p>

          <div class="accordion">
            <details open><summary>Details</summary><ul>${p.details.map((d) => `<li>${d}</li>`).join("")}</ul></details>
            <details><summary>Shipping &amp; exchange</summary><p>Ships in 2–4 working days across India. Free shipping above ${inr(FREE_SHIP)}. Easy 7-day exchanges on unworn pieces with tags.</p></details>
            <details><summary>Care</summary><p>Gentle hand wash cold or dry clean. Dry in shade. Warm iron on reverse.</p></details>
          </div>
        </div>
      </div>`;
  }

  function addCurrentToBag() {
    const { p, color, size } = current;
    if (!size) { $("#pdpHint").textContent = "Please select a size."; return; }
    const colorName = p.colors[color][0];
    const existing = cart.find((i) => i.id === p.id && i.color === colorName && i.size === size);
    if (existing) existing.qty += 1;
    else cart.push({ id: p.id, color: colorName, size, qty: 1 });
    saveCart();
    closeAll();
    setTimeout(() => openDrawer("#cartDrawer"), 250);
    toast(`${p.name} added to your bag`);
  }

  /* =========================================================
     Cart
     ========================================================= */
  function saveCart() { store.set("nohe_cart", cart); renderCart(); }
  const subtotal = () => cart.reduce((s, i) => s + (byId(i.id)?.price || 0) * i.qty, 0);
  const count = () => cart.reduce((s, i) => s + i.qty, 0);
  const colorHex = (p, name) => (p.colors.find((c) => c[0] === name) || p.colors[0])[1];

  function renderCart() {
    cart = cart.filter((i) => byId(i.id));
    const n = count();
    setBadge("#cartCount", n);
    $("#cartHeadCount").textContent = n ? `(${n})` : "";

    const sub = subtotal();
    const left = FREE_SHIP - sub;
    $("#shipText").innerHTML = left > 0 ? `You're <strong>${inr(left)}</strong> away from free shipping` : `You've unlocked <strong>free shipping</strong> ✦`;
    $("#shipBar").style.width = Math.min(100, (sub / FREE_SHIP) * 100) + "%";
    $("#shipProgress").style.display = n ? "" : "none";
    $("#cartFoot").style.display = n ? "" : "none";
    $("#cartSubtotal").textContent = inr(sub);

    if (!n) {
      $("#cartItems").innerHTML = `<div class="drawer__empty"><p>Your bag is empty</p><a href="#shop" class="btn btn--dark" data-close-go>Start shopping</a></div>`;
      return;
    }
    $("#cartItems").innerHTML = cart.map((i, idx) => {
      const p = byId(i.id);
      return `<div class="line-item">
        <div class="line-item__img" data-open="${p.id}">${media(p, colorHex(p, i.color))}</div>
        <div>
          <p class="line-item__name">${p.name}</p>
          <div class="line-item__meta">${i.color} · ${i.size}</div>
          <div class="line-item__actions">
            <div class="qty"><button data-dec="${idx}" aria-label="Decrease">−</button><span>${i.qty}</span><button data-inc="${idx}" aria-label="Increase">+</button></div>
            <button class="link-btn" data-remove="${idx}">Remove</button>
          </div>
        </div>
        <div class="line-item__price">${inr(p.price * i.qty)}</div>
      </div>`;
    }).join("");
  }

  /* =========================================================
     Wishlist
     ========================================================= */
  function toggleWish(id) {
    const p = byId(id);
    if (wish.includes(id)) { wish = wish.filter((w) => w !== id); toast("Removed from wishlist"); }
    else { wish.push(id); toast(`${p.name} saved to wishlist ♡`); }
    store.set("nohe_wish", wish);
    $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("active", wish.includes(id)));
    renderWish();
  }
  function renderWish() {
    setBadge("#wishCount", wish.length);
    if (!wish.length) {
      $("#wishItems").innerHTML = `<div class="drawer__empty"><p>Nothing saved yet</p><a href="#shop" class="btn btn--dark" data-close-go>Discover pieces</a></div>`;
      return;
    }
    $("#wishItems").innerHTML = wish.map(byId).filter(Boolean).map((p) => `
      <div class="line-item">
        <div class="line-item__img" data-open="${p.id}">${media(p)}</div>
        <div>
          <p class="line-item__name">${p.name}</p>
          <div class="line-item__meta">${p.category}</div>
          <div class="line-item__actions">
            <button class="btn btn--dark" style="padding:10px 16px" data-open="${p.id}">Select size</button>
            <button class="link-btn" data-wish="${p.id}">Remove</button>
          </div>
        </div>
        <div class="line-item__price">${inr(p.price)}</div>
      </div>`).join("");
  }

  /* =========================================================
     Checkout (front-end demo — connect payment gateway later)
     ========================================================= */
  function totals() {
    const sub = subtotal();
    const disc = promo ? Math.round(sub * PROMOS[promo]) : 0;
    const ship = sub - disc >= FREE_SHIP || sub === 0 ? 0 : SHIP_FEE;
    return { sub, disc, ship, total: sub - disc + ship };
  }

  function renderCheckout() {
    const t = totals();
    $("#checkoutContent").innerHTML = `
      <div class="checkout">
        <form class="checkout__form" id="checkoutForm" novalidate>
          <h2>Checkout</h2>
          <h4>Contact</h4>
          <div class="fields">
            <label class="field full"><input name="email" type="email" placeholder="Email" required></label>
            <label class="field full"><input name="phone" type="tel" placeholder="Phone (+91)" required pattern="[0-9+ ]{10,14}"></label>
          </div>
          <h4>Delivery address</h4>
          <div class="fields">
            <label class="field"><input name="first" placeholder="First name" required></label>
            <label class="field"><input name="last" placeholder="Last name" required></label>
            <label class="field full"><input name="address" placeholder="Address" required></label>
            <label class="field"><input name="city" placeholder="City" required></label>
            <label class="field"><input name="pin" placeholder="PIN code" required pattern="[0-9]{6}" inputmode="numeric"></label>
            <label class="field full"><select name="state" required>
              <option value="">State</option>${["Andhra Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"].map((s) => `<option>${s}</option>`).join("")}
            </select></label>
          </div>
          <h4>Payment</h4>
          <div class="pay-opts">
            <label class="pay-opt"><input type="radio" name="pay" value="upi" checked> UPI <small>GPay · PhonePe · Paytm</small></label>
            <label class="pay-opt"><input type="radio" name="pay" value="card"> Credit / Debit card <small>Visa · Mastercard · RuPay</small></label>
            <label class="pay-opt"><input type="radio" name="pay" value="cod"> Cash on delivery <small>Pay when it arrives</small></label>
          </div>
          <p class="pdp__hint" id="coHint"></p>
          <button class="btn btn--dark btn--full" type="submit" style="margin-top:14px">Place order — ${inr(t.total)}</button>
        </form>
        <aside class="checkout__summary">
          <h3>Order summary</h3>
          ${cart.map((i) => { const p = byId(i.id); return `
            <div class="sum-item">
              <div class="sum-item__img">${media(p, colorHex(p, i.color))}<span class="sum-item__q">${i.qty}</span></div>
              <div>${p.name}<small>${i.color} · ${i.size}</small></div>
              <div>${inr(p.price * i.qty)}</div>
            </div>`; }).join("")}
          <form class="promo" id="promoForm"><input placeholder="Discount code" id="promoInput" value="${promo || ""}"><button type="submit">Apply</button></form>
          <p class="promo-msg" id="promoMsg">${promo ? `${promo} applied — ${PROMOS[promo] * 100}% off` : "Try WELCOME10"}</p>
          <div class="sum-lines">
            <div><span>Subtotal</span><span>${inr(t.sub)}</span></div>
            ${t.disc ? `<div><span>Discount</span><span>− ${inr(t.disc)}</span></div>` : ""}
            <div><span>Shipping</span><span>${t.ship ? inr(t.ship) : "Free"}</span></div>
            <div class="total"><span>Total</span><strong>${inr(t.total)}</strong></div>
          </div>
        </aside>
      </div>`;
  }

  function placeOrder(form) {
    if (!form.checkValidity()) {
      const bad = form.querySelector(":invalid");
      $("#coHint").textContent = "Please complete all fields correctly.";
      bad && bad.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const orderNo = "NH" + Date.now().toString().slice(-6);
    // TODO: send `data` + `cart` to your payment gateway / backend (Razorpay, Shopify, Stripe…)
    cart = []; promo = null; saveCart();
    $("#checkoutContent").innerHTML = `
      <div class="confirm">
        <div class="confirm__icon"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></div>
        <p class="eyebrow">Order ${orderNo}</p>
        <h2>Thank you, ${escapeHTML(data.first)}.</h2>
        <p>Your order is confirmed. We'll send updates to <strong>${escapeHTML(data.email)}</strong>. Every Nohé piece is checked and wrapped by hand — it'll be with you soon.</p>
        <button class="btn btn--dark" data-close style="margin-top:20px">Continue shopping</button>
      </div>`;
  }

  /* =========================================================
     Search
     ========================================================= */
  function renderSearch(q) {
    q = q.trim().toLowerCase();
    const list = q ? PRODUCTS.filter((p) => [p.name, p.category, p.collection, p.description, ...p.colors.map((c) => c[0])].join(" ").toLowerCase().includes(q)) : PRODUCTS.filter((p) => p.bestseller);
    $("#searchResults").innerHTML =
      `<p class="hint">${q ? `${list.length} result${list.length === 1 ? "" : "s"} for “${escapeHTML(q)}”` : "Popular right now"}</p>` +
      list.map((p) => `<div class="s-item" data-open="${p.id}"><div class="s-item__img">${media(p)}</div><p>${p.name}</p><span>${inr(p.price)}</span></div>`).join("");
  }

  /* =========================================================
     Info pages
     ========================================================= */
  const INFO = {
    shipping: `<h2>Shipping</h2><p>We ship across India. Orders are dispatched within 2–4 working days and usually arrive in 3–7 days.</p><ul><li>Free shipping on orders above ${inr(FREE_SHIP)}</li><li>${inr(SHIP_FEE)} flat fee below that</li><li>Tracking link sent by email &amp; SMS</li></ul>`,
    returns: `<h2>Exchanges &amp; returns</h2><p>Not quite right? We offer easy exchanges within 7 days of delivery on unworn pieces with original tags.</p><p>Write to us at hello@nohe.in or DM <strong>@in.nohe</strong> with your order number and we'll arrange a pickup.</p>`,
    size: `<h2>Size guide</h2><p>Measurements in inches. Between sizes? Size up for a relaxed fit.</p>
      <table class="size-table"><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th></tr>
      <tr><td>XS</td><td>32</td><td>26</td><td>35</td></tr><tr><td>S</td><td>34</td><td>28</td><td>37</td></tr>
      <tr><td>M</td><td>36</td><td>30</td><td>39</td></tr><tr><td>L</td><td>38</td><td>32</td><td>41</td></tr>
      <tr><td>XL</td><td>40</td><td>34</td><td>43</td></tr></table>`,
    care: `<h2>Garment care</h2><ul><li>Hand wash cold or gentle machine cycle in a laundry bag</li><li>Avoid bleach and tumble drying</li><li>Dry flat in the shade to keep colours rich</li><li>Steam or warm iron on the reverse</li></ul>`
  };

  /* =========================================================
     UI helpers: drawers, modals, toast, badges
     ========================================================= */
  const overlay = $("#overlay");
  function lock(on) { document.body.classList.toggle("locked", on); }
  function openDrawer(sel) {
    closeAll(true);
    const el = $(sel); el.classList.add("open"); el.setAttribute("aria-hidden", "false");
    overlay.classList.add("show"); lock(true);
  }
  function openModal(sel) {
    $$(".drawer.open, .mobile-menu.open, .search.open").forEach((d) => d.classList.remove("open"));
    overlay.classList.remove("show");
    $$(".modal.open").forEach((m) => m !== $(sel) && m.classList.remove("open"));
    const el = $(sel); el.classList.add("open"); el.setAttribute("aria-hidden", "false"); lock(true);
    const box = $(".modal__box", el); box && (box.scrollTop = 0);
  }
  function closeAll(keepLock) {
    $$(".drawer.open, .mobile-menu.open, .modal.open, .search.open").forEach((d) => { d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); });
    overlay.classList.remove("show");
    if (!keepLock) lock(false);
  }
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }
  function setBadge(sel, n) {
    const b = $(sel); const prev = +b.textContent;
    b.textContent = n; b.classList.toggle("show", n > 0);
    if (n > prev) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  }
  function escapeHTML(s = "") { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* Reveal on scroll */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }) : null;
  function observeReveal(root = document) {
    $$(".reveal:not(.in)", root).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  }

  /* =========================================================
     Events (delegated)
     ========================================================= */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const wishBtn = t.closest("[data-wish]");
    if (wishBtn) { e.preventDefault(); e.stopPropagation(); toggleWish(wishBtn.dataset.wish); if (current && $("#productModal").classList.contains("open")) renderProduct(); return; }

    const opener = t.closest("[data-open]");
    if (opener) { e.preventDefault(); openProduct(opener.dataset.open); return; }

    const chip = t.closest(".chip[data-cat]");
    if (chip) { state.collection = null; state.cat = chip.dataset.cat; renderGrid(); return; }

    const cat = t.closest(".cat[data-cat]");
    if (cat) { setFilter(cat.dataset.cat); }

    const fl = t.closest("[data-filter-link]");
    if (fl) { closeAll(); setFilter(fl.dataset.filterLink); }

    if (t.closest("[data-close]")) { closeAll(); return; }
    if (t.closest("[data-close-go]")) { closeAll(); }
    if (t.classList.contains("modal")) { closeAll(); return; }

    const info = t.closest("[data-info]");
    if (info) { e.preventDefault(); $("#infoContent").innerHTML = `<div class="info">${INFO[info.dataset.info]}</div>`; openModal("#infoModal"); return; }

    // product modal options
    const ci = t.closest("[data-color-i]");
    if (ci && current) { current.color = +ci.dataset.colorI; renderProduct(); return; }
    const sz = t.closest(".size-opt");
    if (sz && current && !sz.disabled) { current.size = sz.dataset.size; renderProduct(); return; }
    if (t.closest("#addToBag")) { addCurrentToBag(); return; }

    // cart qty
    const inc = t.closest("[data-inc]"), dec = t.closest("[data-dec]"), rem = t.closest("[data-remove]");
    if (inc) { cart[+inc.dataset.inc].qty++; saveCart(); return; }
    if (dec) { const i = +dec.dataset.dec; cart[i].qty--; if (cart[i].qty < 1) cart.splice(i, 1); saveCart(); return; }
    if (rem) { cart.splice(+rem.dataset.remove, 1); saveCart(); return; }
  });

  overlay.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  $("#cartBtn").addEventListener("click", () => openDrawer("#cartDrawer"));
  $("#wishBtn").addEventListener("click", () => openDrawer("#wishDrawer"));
  $("#menuBtn").addEventListener("click", () => { closeAll(true); $("#mobileMenu").classList.add("open"); overlay.classList.add("show"); lock(true); });
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => closeAll()));
  $("#searchBtn").addEventListener("click", () => {
    closeAll(true); $("#searchPanel").classList.add("open"); overlay.classList.add("show"); lock(true);
    renderSearch($("#searchInput").value); setTimeout(() => $("#searchInput").focus(), 300);
  });
  $("#searchInput").addEventListener("input", (e) => renderSearch(e.target.value));

  $("#checkoutBtn").addEventListener("click", () => { if (!cart.length) return; renderCheckout(); openModal("#checkoutModal"); });
  $("#checkoutModal").addEventListener("submit", (e) => {
    e.preventDefault();
    if (e.target.id === "promoForm") {
      const code = $("#promoInput").value.trim().toUpperCase();
      if (PROMOS[code]) { promo = code; renderCheckout(); toast(`${code} applied`); }
      else { $("#promoMsg").textContent = "That code isn't valid."; }
    } else if (e.target.id === "checkoutForm") placeOrder(e.target);
  });

  $("#sizeFilter").addEventListener("change", (e) => { state.size = e.target.value; renderGrid(); });
  $("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });

  const emailForm = (sel, msg) => $(sel).addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: connect to Mailchimp / Klaviyo / Google Sheet
    e.target.reset(); toast(msg);
  });
  emailForm("#menForm", "You're on the list — we'll tell you first ✦");
  emailForm("#newsForm", "Welcome to Nohé! Use WELCOME10 for 10% off.");

  const header = $("#header");
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  paintArt();
  renderGrid();
  renderCart();
  renderWish();
  observeReveal();
})();
