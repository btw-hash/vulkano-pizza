// VULKANO app: cart (localStorage), drawer, toasts, filters, product, checkout, tracking
const CART_KEY = 'vulkano_cart';
const ORDER_KEY = 'vulkano_order';
const PROMO = { VULKANO10: 0.1 };
const DELIVERY_FREE_FROM = 600;
const DELIVERY_FEE = 69;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uah = (n) => `${Math.round(n)} ₴`;
const pizzaById = (id) => PIZZAS.find((p) => p.id === id);

/* ---------- cart core ---------- */
function getCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    return raw.filter((l) => l && pizzaById(l.id));
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
  renderDrawer();
  if ($('#cart-page')) renderCartPage();
}
function lineKey(l) {
  return [l.id, l.size, l.crust, (l.extras || []).slice().sort().join('+')].join('|');
}
function linePrice(l) {
  const p = pizzaById(l.id);
  if (!p) return 0;
  const crust = CRUSTS.find((c) => c.id === l.crust);
  const extras = (l.extras || []).reduce(
    (s, e) => s + (EXTRAS.find((x) => x.id === e)?.add || 0),
    0
  );
  return p.prices[l.size] + (crust?.add || 0) + extras;
}
function addToCart(line) {
  const cart = getCart();
  const key = lineKey(line);
  const found = cart.find((l) => lineKey(l) === key);
  if (found) found.qty += line.qty;
  else cart.push(line);
  saveCart(cart);
  toast(`${pizzaById(line.id).name} — у кошику`);
  bumpCartBtn();
}
function setQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty = Math.max(0, qty);
  if (cart[index].qty === 0) cart.splice(index, 1);
  saveCart(cart);
}
function cartTotals(promoCode) {
  const cart = getCart();
  const subtotal = cart.reduce((s, l) => s + linePrice(l) * l.qty, 0);
  const discount = promoCode && PROMO[promoCode] ? subtotal * PROMO[promoCode] : 0;
  const delivery =
    subtotal === 0 ? 0 : subtotal - discount >= DELIVERY_FREE_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

/* ---------- UI: header count, drawer, toasts ---------- */
function renderCartCount() {
  const n = getCart().reduce((s, l) => s + l.qty, 0);
  $$('.cart-btn .count').forEach((el) => (el.textContent = n));
}
function bumpCartBtn() {
  $$('.cart-btn').forEach((b) => {
    b.style.transform = 'scale(1.12)';
    setTimeout(() => (b.style.transform = ''), 180);
  });
}
function toast(msg) {
  let wrap = $('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('out'), 2400);
  setTimeout(() => t.remove(), 2800);
}
function drawerHTML() {
  return `
  <div class="drawer-overlay" id="drawer-overlay"></div>
  <aside class="drawer" id="drawer" aria-label="Кошик">
    <div class="drawer-head">
      <h3>Ваше замовлення</h3>
      <button class="drawer-close" id="drawer-close" aria-label="Закрити">×</button>
    </div>
    <div class="drawer-items" id="drawer-items"></div>
    <div class="drawer-foot" id="drawer-foot"></div>
  </aside>`;
}
function renderDrawer() {
  const items = $('#drawer-items');
  const foot = $('#drawer-foot');
  if (!items) return;
  const cart = getCart();
  if (!cart.length) {
    items.innerHTML = `<div class="drawer-empty"><div class="big">440°</div>Кошик порожній.<br>Піч вже гаряча — обирайте піцу.</div>`;
    foot.innerHTML = `<a class="btn btn-fire btn-sm" style="width:100%" href="menu.html">До меню</a>`;
    return;
  }
  items.innerHTML = cart
    .map((l, i) => {
      const p = pizzaById(l.id);
      const crust = CRUSTS.find((c) => c.id === l.crust);
      return `<div class="drawer-item">
        <img src="${p.img}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <div class="meta">${SIZE_LABEL[l.size]}${crust && crust.add ? ' · ' + crust.name : ''}</div>
          <div class="mini-qty">
            <button data-dq="${i}" aria-label="менше">−</button><b>${l.qty}</b><button data-iq="${i}" aria-label="більше">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <button class="rm" data-rm="${i}" aria-label="прибрати">×</button>
          <div class="price">${uah(linePrice(l) * l.qty)}</div>
        </div>
      </div>`;
    })
    .join('');
  const t = cartTotals();
  foot.innerHTML = `
    <div class="drawer-total"><span class="muted">Разом</span><b>${uah(t.subtotal)}</b></div>
    <a class="btn btn-fire" style="width:100%" href="cart.html">Оформити замовлення</a>`;
  $$('[data-dq]', items).forEach((b) =>
    b.addEventListener('click', () => setQty(+b.dataset.dq, getCart()[+b.dataset.dq].qty - 1))
  );
  $$('[data-iq]', items).forEach((b) =>
    b.addEventListener('click', () => setQty(+b.dataset.iq, getCart()[+b.dataset.iq].qty + 1))
  );
  $$('[data-rm]', items).forEach((b) =>
    b.addEventListener('click', () => setQty(+b.dataset.rm, 0))
  );
}
function openDrawer() {
  $('#drawer').classList.add('open');
  $('#drawer-overlay').classList.add('open');
}
function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#drawer-overlay').classList.remove('open');
}

/* ---------- menu page ---------- */
function pizzaCard(p) {
  return `<article class="card reveal">
    <a class="imgw" href="product.html?id=${p.id}">
      ${p.badge ? `<span class="badge${p.badgeGold ? ' gold' : ''}">${p.badge}</span>` : ''}
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </a>
    <div class="card-body">
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <p>${p.desc}</p>
      <div class="card-row">
        <span class="price">${uah(p.prices[32])} <small>/ 32 см</small></span>
        <button class="add-btn" data-quick="${p.id}">У кошик</button>
      </div>
    </div>
  </article>`;
}
function initMenu() {
  const grid = $('#menu-grid');
  if (!grid) return;
  const render = (tag) => {
    const list = tag === 'всі' ? PIZZAS : PIZZAS.filter((p) => p.tags.includes(tag));
    grid.innerHTML = list.map(pizzaCard).join('');
    $$('[data-quick]', grid).forEach((b) =>
      b.addEventListener('click', () =>
        addToCart({ id: b.dataset.quick, size: 32, crust: 'classic', extras: [], qty: 1 })
      )
    );
    observeReveals(grid);
  };
  render('всі');
  $$('.filters .chip').forEach((c) =>
    c.addEventListener('click', () => {
      $$('.filters .chip').forEach((x) => x.classList.remove('active'));
      c.classList.add('active');
      render(c.dataset.tag);
    })
  );
}

/* ---------- home popular ---------- */
function initHome() {
  const grid = $('#popular-grid');
  if (!grid) return;
  const ids = ['pepperoni-basil', 'quattro-formaggi', 'rucola-prosciutto'];
  grid.innerHTML = ids.map((id) => pizzaCard(pizzaById(id))).join('');
  $$('[data-quick]', grid).forEach((b) =>
    b.addEventListener('click', () =>
      addToCart({ id: b.dataset.quick, size: 32, crust: 'classic', extras: [], qty: 1 })
    )
  );
}

/* ---------- product page ---------- */
function initProduct() {
  const root = $('#product-root');
  if (!root) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = pizzaById(id) || PIZZAS[0];
  document.title = `${p.name} — VULKANO`;
  const state = { id: p.id, size: 32, crust: 'classic', extras: [], qty: 1 };
  root.innerHTML = `
  <div class="product">
    <div class="imgw reveal in"><img src="${p.img}" alt="${p.name}"></div>
    <div>
      <p class="kicker">${p.tags.join(' · ')}</p>
      <h1 style="font-size:clamp(30px,3.6vw,48px)">${p.name}</h1>
      <p class="muted" style="margin-top:14px">${p.desc}</p>
      <div class="ing-tags">${p.ingredients.map((i) => `<span class="ing">${i}</span>`).join('')}</div>
      <div class="opt-group"><span>Розмір</span><div class="opt-row" id="opt-size">
        ${Object.keys(p.prices)
          .map(
            (s) =>
              `<button class="opt${+s === 32 ? ' active' : ''}" data-size="${s}">${SIZE_LABEL[s]}<small>${uah(p.prices[s])}</small></button>`
          )
          .join('')}
      </div></div>
      <div class="opt-group"><span>Борт</span><div class="opt-row" id="opt-crust">
        ${CRUSTS.map((c) => `<button class="opt${c.id === 'classic' ? ' active' : ''}" data-crust="${c.id}">${c.name}<small>${c.add ? '+' + uah(c.add) : 'базово'}</small></button>`).join('')}
      </div></div>
      <div class="opt-group"><span>Додатки</span><div class="opt-row" id="opt-extras">
        ${EXTRAS.map((e) => `<button class="opt" data-extra="${e.id}">${e.name}<small>+${uah(e.add)}</small></button>`).join('')}
      </div></div>
      <div class="opt-group" style="display:flex;align-items:center;gap:22px;flex-wrap:wrap">
        <div class="qty">
          <button id="q-minus" aria-label="менше">−</button><b id="q-val">1</b><button id="q-plus" aria-label="більше">+</button>
        </div>
        <div class="product-total" id="p-total"></div>
      </div>
      <div style="margin-top:26px;display:flex;gap:14px;flex-wrap:wrap">
        <button class="btn btn-fire mag" id="p-add">Додати в кошик</button>
        <a class="btn btn-ghost" href="menu.html">← До меню</a>
      </div>
    </div>
  </div>`;
  const recalc = () => {
    const price =
      (p.prices[state.size] +
        (CRUSTS.find((c) => c.id === state.crust)?.add || 0) +
        state.extras.reduce((s, e) => s + EXTRAS.find((x) => x.id === e).add, 0)) *
      state.qty;
    $('#p-total').textContent = uah(price);
    $('#q-val').textContent = state.qty;
  };
  $$('#opt-size .opt').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#opt-size .opt').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      state.size = +b.dataset.size;
      recalc();
    })
  );
  $$('#opt-crust .opt').forEach((b) =>
    b.addEventListener('click', () => {
      $$('#opt-crust .opt').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      state.crust = b.dataset.crust;
      recalc();
    })
  );
  $$('#opt-extras .opt').forEach((b) =>
    b.addEventListener('click', () => {
      b.classList.toggle('active');
      state.extras = $$('#opt-extras .opt.active').map((x) => x.dataset.extra);
      recalc();
    })
  );
  $('#q-minus').addEventListener('click', () => {
    state.qty = Math.max(1, state.qty - 1);
    recalc();
  });
  $('#q-plus').addEventListener('click', () => {
    state.qty++;
    recalc();
  });
  $('#p-add').addEventListener('click', () => {
    addToCart({ ...state });
    openDrawer();
  });
  recalc();
}

/* ---------- cart page + checkout ---------- */
let promoApplied = '';
function renderCartPage() {
  const list = $('#cart-items');
  if (!list) return;
  const cart = getCart();
  if (!cart.length) {
    $('#cart-page').innerHTML = `
      <div style="text-align:center;padding:70px 0">
        <div style="font-family:var(--font-d);font-weight:800;font-size:54px;color:var(--gold)">440°</div>
        <h2 style="margin:14px 0">Кошик порожній</h2>
        <p class="muted" style="margin-bottom:28px">Піч гаряча, тісто чекає. Виправимо?</p>
        <a class="btn btn-fire" href="menu.html">Обрати піцу</a>
      </div>`;
    return;
  }
  list.innerHTML = cart
    .map((l, i) => {
      const p = pizzaById(l.id);
      const crust = CRUSTS.find((c) => c.id === l.crust);
      const extras = (l.extras || [])
        .map((e) => EXTRAS.find((x) => x.id === e)?.name)
        .filter(Boolean);
      return `<div class="cart-item">
      <img src="${p.img}" alt="${p.name}">
      <div>
        <h4>${p.name}</h4>
        <div class="meta">${SIZE_LABEL[l.size]}${crust && crust.add ? ' · ' + crust.name : ''}${extras.length ? ' · ' + extras.join(', ') : ''}</div>
        <div class="mini-qty" style="margin-top:10px">
          <button data-cdq="${i}">−</button><b>${l.qty}</b><button data-ciq="${i}">+</button>
        </div>
      </div>
      <div class="col-r">
        <button class="rm" data-crm="${i}" aria-label="прибрати">×</button>
        <div class="price">${uah(linePrice(l) * l.qty)}</div>
      </div>
    </div>`;
    })
    .join('');
  $$('[data-cdq]').forEach((b) =>
    b.addEventListener('click', () => setQty(+b.dataset.cdq, getCart()[+b.dataset.cdq].qty - 1))
  );
  $$('[data-ciq]').forEach((b) =>
    b.addEventListener('click', () => setQty(+b.dataset.ciq, getCart()[+b.dataset.ciq].qty + 1))
  );
  $$('[data-crm]').forEach((b) => b.addEventListener('click', () => setQty(+b.dataset.crm, 0)));
  renderTotals();
}
function renderTotals() {
  const box = $('#totals');
  if (!box) return;
  const t = cartTotals(promoApplied);
  box.innerHTML = `
    <div class="total-line"><span>Сума</span><span>${uah(t.subtotal)}</span></div>
    ${t.discount ? `<div class="total-line"><span>Промокод −10%</span><span class="ok">−${uah(t.discount)}</span></div>` : ''}
    <div class="total-line"><span>Доставка</span><span>${t.delivery === 0 ? '<span class="ok">безкоштовно</span>' : uah(t.delivery)}</span></div>
    <div class="total-line grand"><span>Разом</span><b>${uah(t.total)}</b></div>`;
}
function initCheckout() {
  const form = $('#checkout-form');
  if (!form) return;
  renderCartPage();
  $('#promo-apply')?.addEventListener('click', () => {
    const val = $('#promo-input').value.trim().toUpperCase();
    if (PROMO[val]) {
      promoApplied = val;
      toast('Промокод застосовано: −10%');
    } else {
      promoApplied = '';
      toast('Такого промокоду немає');
    }
    renderTotals();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!getCart().length) {
      toast('Кошик порожній — додайте піцу');
      return;
    }
    const fields = [
      { el: $('#f-name'), ok: (v) => v.trim().length >= 2 },
      {
        el: $('#f-phone'),
        ok: (v) =>
          /^\+?3?8?\(?0\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(v.replace(/\s/g, '')),
      },
      { el: $('#f-addr'), ok: (v) => v.trim().length >= 6 },
    ];
    let valid = true;
    fields.forEach(({ el, ok }) => {
      const row = el.closest('.form-row');
      const good = ok(el.value);
      row.classList.toggle('invalid', !good);
      el.classList.toggle('err', !good);
      if (!good) valid = false;
    });
    if (!valid) {
      toast('Перевірте виділені поля');
      return;
    }
    const orderNo = 'V-' + String(Math.floor(1000 + Math.random() * 9000));
    const t = cartTotals(promoApplied);
    localStorage.setItem(
      ORDER_KEY,
      JSON.stringify({
        no: orderNo,
        total: t.total,
        at: Date.now(),
        name: $('#f-name').value.trim(),
      })
    );
    localStorage.removeItem(CART_KEY);
    $('#order-no').textContent = orderNo;
    $('#success-overlay').classList.add('show');
  });
}

/* ---------- tracking page ---------- */
function initTracking() {
  const root = $('#track-root');
  if (!root) return;
  let order = null;
  try {
    order = JSON.parse(localStorage.getItem(ORDER_KEY));
  } catch {}
  if (!order) {
    $('#track-meta').innerHTML =
      `Замовлень не знайдено. <a href="menu.html" style="color:var(--gold)">Зробіть перше</a> — і повертайтесь.`;
    return;
  }
  $('#track-meta').innerHTML =
    `Замовлення <b style="color:var(--gold)">${order.no}</b> · ${uah(order.total)} · дякуємо, ${order.name}!`;
  const steps = $$('.tstep');
  const fill = $('.track-line-fill');
  const STEP_MS = 5000;
  const start = order.at;
  const update = () => {
    const elapsed = Date.now() - start;
    let stage = Math.min(steps.length - 1, Math.floor(elapsed / STEP_MS));
    steps.forEach((s, i) => {
      s.classList.toggle('done', i < stage);
      s.classList.toggle('now', i === stage);
    });
    const pct = (stage / (steps.length - 1)) * 100;
    fill.style.height = pct + '%';
    const totalEta = STEP_MS * (steps.length - 1);
    const left = Math.max(0, totalEta - elapsed);
    const mm = String(Math.floor(left / 60000)).padStart(2, '0');
    const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
    $('#eta-time').textContent = left === 0 ? 'Смачного!' : `${mm}:${ss}`;
    if (left > 0) requestAnimationFrame(() => setTimeout(update, 250));
    else {
      steps.forEach((s) => s.classList.add('done'));
      steps[steps.length - 1].classList.add('now');
    }
  };
  update();
  $('#track-replay')?.addEventListener('click', () => {
    order.at = Date.now();
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    update();
  });
}

/* ---------- reveals ---------- */
let revealIO;
function observeReveals(root = document) {
  if (!revealIO) {
    revealIO = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealIO.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
  }
  $$('.reveal:not(.in)', root).forEach((el) => revealIO.observe(el));
}

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('beforeend', drawerHTML());
  renderCartCount();
  renderDrawer();
  $$('.cart-btn').forEach((b) =>
    b.addEventListener('click', (e) => {
      if (location.pathname.endsWith('cart.html')) return;
      e.preventDefault();
      openDrawer();
    })
  );
  $('#drawer-close').addEventListener('click', closeDrawer);
  $('#drawer-overlay').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeDrawer());
  $('.burger')?.addEventListener('click', function () {
    this.classList.toggle('open');
    $('.nav-links').classList.toggle('open');
  });
  initHome();
  initMenu();
  initProduct();
  initCheckout();
  initTracking();
  observeReveals();
  setTimeout(() => document.body.classList.add('lines-in'), 80);
});
