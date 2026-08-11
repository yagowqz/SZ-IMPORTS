const PRODUCTS = [
  { id:1, cat:'fones', name:'Fone Sem Fio i12 Bluetooth 5.3 ', desc:'Conexão rápida Bluetooth 5.3, Selo Anatel, compatível com iOS e Android.', price:50.00, anatel:true, popular:true, img:'images/fonelehmox.jpg' },
  { id:2, cat:'fones', name:'Fone de Ouvido Tipo-C ', desc:'Para Android e iPhone Type-C, zero atraso em áudios e vídeos, confortável e prático.', price:35.00, anatel:false, popular:false, img:'images/fonetipoc.jpg' },
  { id:3, cat:'fones', name:'Headphone Sem Fio P9', desc:'Conexão rápida Bluetooth, almofadas macias para uso prolongado, design moderno e Selo Anatel.', price:40.00, anatel:true, popular:true, img:'images/p9-fone.jpg.webp' },
  { id:4, cat:'fones', name:'Fone Sem Fio Gamer com Display LED ', desc:'Bluetooth 5.3 ultra rápido, Selo Anatel, case com display LED indicando % da bateria.', price:40.00, anatel:true, popular:false, img:'images/starmega.jpg' },
  { id:5, cat:'fones', name:'Fone de Ouvido com Fio Super Bass ', desc:'Graves reforçados (Super Bass), microfone integrado para chamadas e áudios.', price:18.00, anatel:false, popular:false, img:'images/dotcell.jpg' },
  { id:6, cat:'fones', name:'Fone Sem Fio Gamer', desc:'Bluetooth 5.3 sem lag para vídeos e jogos, Selo Anatel, sensor de toque inteligente.', price:50.00, anatel:true, popular:true, img:'images/fone12.jpg' },
  { id:7, cat:'fones', name:'Fone Sem Fio i12 Cores Pastéis', desc:'Conexão estável Bluetooth, Selo Anatel, cores pastéis super modernas e elegantes.', price:50.00, anatel:true, popular:false, img:'images/fonecolorido.jpg' },
  { id:8, cat:'carregadores', name:'Fonte Carregador Rápido LE-521 3.1A (Lehmox)', desc:'Carga rápida 3.1A, Selo de qualidade Anatel, funciona com qualquer cabo USB.', price:15.00, anatel:true, popular:false, img:'images/fonterapida1.jpg' },
  { id:9, cat:'carregadores', name:'TURBO Kit Carregador 25W + Cabo iOS/iPhone (Lehmox)', desc:'25W de potência real, Selo Anatel, acompanha cabo Lightning/iPhone reforçado.', price:40.00, anatel:true, popular:true, img:'images/kitios.jpg' },
  { id:10, cat:'carregadores', name:'Carregador Rápido 5.1A USB + PD Power Delivery LE-486 (Lehmox)', desc:'Carregamento super rápido, Selo Anatel, saídas duplas USB + Type-C PD.', price:35.00, anatel:true, popular:false, img:'images/5.1tipoc.jpg' },
  { id:11, cat:'relogios', name:'Smartwatch Inteligente (Monitoramento & Notificações)', desc:'Monitor de saúde, notificações de redes sociais, resistente à água e bateria de longa duração.', price:99.00, anatel:false, popular:false, img:'images/smartwatch.svg' },
  { id:12, cat:'games', name:'Game Stick 4K HDMI com 2 Controles Sem Fio', desc:'Mais de 20.000 jogos retrô, conexão HDMI Plug & Play para qualquer TV.', price:180.00, anatel:false, popular:true, img:'images/gamestick.jpg' },
];

const FAQS = [
  { q:'Como funciona a entrega?', a:'A SZ Imports é uma loja 100% online. Entregamos rápido direto no seu endereço em Fortaleza (taxa de R$ 8,00) e Caucaia (taxa de R$ 5,00). O valor da entrega é somado automaticamente no carrinho.' },
  { q:'Quais formas de pagamento vocês aceitam?', a:'Aceitamos Pix e Cartão de Crédito/Débito. Você escolhe a forma de pagamento na hora de finalizar o pedido pelo carrinho.' },
  { q:'Os produtos têm selo Anatel?', a:'Sim, os produtos elegíveis contam com Selo Anatel, garantindo qualidade e conformidade. Isso está indicado diretamente no card de cada produto.' },
  { q:'Como faço meu pedido?', a:'Adicione os produtos ao carrinho, escolha sua cidade e forma de pagamento, preencha seus dados e clique em "Finalizar Pedido no WhatsApp". Sua mensagem já sai pronta para a gente confirmar tudo.' },
];

const HIGHLIGHT_PRODUCT_ID = 12;

const FEEDBACKS = [
  { text:'Entrega rápida e atendimento super atencioso. Recebi o pedido no mesmo dia em Fortaleza e amei o fone i12.', author:'Mariana S.', location:'Fortaleza' },
  { text:'Comprei o kit de carregador e chegou perfeito. Ótimo preço e a conversa pelo WhatsApp foi bem prática.', author:'Lucas R.', location:'Caucaia' },
  { text:'O smartwatch chegou com qualidade e a entrega foi muito rápida. Recomendo demais a SZ Imports.', author:'Ana C.', location:'Fortaleza' },
];

const STORAGE_KEY = 'szimports-cart-v1';
const WHATSAPP_NUMBER = '5585989352819';
const DELIVERY_FEES = { fortaleza: 8.00, caucaia: 5.00 };

let cart = {}; // { productId: qty }
let selectedCity = 'fortaleza';
let selectedPayment = 'Pix';
let storedCEP = '';
let catalogState = { category:'todos', search:'', sort:'todos' };

function formatBRL(v){
  return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

function saveCartToStorage(){
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, selectedCity, selectedPayment, storedCEP }));
  } catch (err) {
    console.warn('Não foi possível salvar o carrinho no localStorage.', err);
  }
}

function loadCartFromStorage(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data?.cart && typeof data.cart === 'object') cart = data.cart;
    if (data?.selectedCity) selectedCity = data.selectedCity;
    if (data?.selectedPayment) selectedPayment = data.selectedPayment;
    if (data?.storedCEP) storedCEP = data.storedCEP;
  } catch (err) {
    cart = {};
  }
}

function clearCart(){
  cart = {};
  saveCartToStorage();
  updateCartUI();
}

function formatCEP(value){
  const digits = (value || '').replace(/\D/g, '').slice(0,8);
  if (!digits) return '';
  return digits.length > 5 ? `${digits.slice(0,5)}-${digits.slice(5)}` : digits;
}

function validateCEP(value){
  const digits = (value || '').replace(/\D/g, '');
  if (!digits) return { valid:true, message:'', city:null };
  if (digits.length !== 8) return { valid:false, message:'CEP deve conter 8 números.', city:null };
  return { valid:true, message:'', city: digits.startsWith('61') ? 'caucaia' : digits.startsWith('60') ? 'fortaleza' : null };
}

function setCEPError(message){
  const input = document.getElementById('cepInput');
  const error = document.getElementById('cepError');
  if (!input || !error) return;
  if (message){
    input.classList.add('input-error');
    error.textContent = message;
  } else {
    input.classList.remove('input-error');
    error.textContent = '';
  }
}

function refreshDeliverySummary(items){
  const deliveryLabel = document.getElementById('deliveryLabel');
  const deliveryValue = document.getElementById('deliveryFee');
  const totalValue = document.getElementById('totalPrice');
  if (!deliveryLabel || !deliveryValue || !totalValue) return;
  const fee = items.length ? DELIVERY_FEES[selectedCity] : 0;
  deliveryLabel.textContent = `Entrega (${selectedCity==='fortaleza'?'Fortaleza':'Caucaia'})`;
  deliveryValue.textContent = formatBRL(fee);
  totalValue.textContent = formatBRL(items.reduce((s,i) => s + i.price * i.qty, 0) + fee);
}

function applyCatalogFilters(){
  const query = catalogState.search.trim().toLowerCase();
  let list = catalogState.category === 'todos'
    ? PRODUCTS.slice()
    : PRODUCTS.filter(p => p.cat === catalogState.category);

  if (query){
    list = list.filter(p => {
      const text = `${p.name} ${p.desc} ${formatBRL(p.price)}`.toLowerCase();
      return text.includes(query) || p.price.toString().includes(query.replace(',', '.'));
    });
  }

  if (catalogState.sort === 'menor'){
    list.sort((a,b) => a.price - b.price);
  } else if (catalogState.sort === 'maisVendidos'){
    list.sort((a,b) => {
      if (a.popular === b.popular) return b.id - a.id;
      return a.popular ? -1 : 1;
    });
  } else if (catalogState.sort === 'novidades'){
    list.sort((a,b) => b.id - a.id);
  }

  return list;
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  const list = applyCatalogFilters();
  if (!list.length){
    grid.innerHTML = '<div class="catalog-empty">Nenhum produto encontrado. Tente outro termo de busca ou filtro.</div>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="card" data-product-id="${p.id}">
      <div class="card__img">
        ${p.img ? `<div class="img-placeholder">Carregando imagem...</div><img src="${p.img}" alt="${p.name}" loading="lazy" onload="this.closest('.card__img').classList.add('loaded')" onerror="this.closest('.card__img').classList.add('error')">` : `<div class="img-ph">Foto do produto<br>(substituir src)</div>`}
        ${p.anatel ? `<span class="badge-anatel">Selo Anatel</span>` : ''}
        ${p.popular ? `<span class="badge-popular">Mais vendido</span>` : ''}
      </div>
      <div class="card__body">
        <span class="card__cat">${catLabel(p.cat)}</span>
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__foot">
          <div class="price">${formatBRL(p.price)}</div>
          <button class="add-btn" onclick="addToCart(${p.id})" aria-label="Adicionar ao carrinho">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function catLabel(cat){
  return { fones:'Fones de Ouvido', carregadores:'Carregadores & Cabos', relogios:'Relógios & Smartwatches', games:'Game Sticks HDMI' }[cat] || cat;
}

document.getElementById('filters').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if(!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  catalogState.category = btn.dataset.cat;
  renderProducts();
});

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  updateCartUI();
  openCart();
}
function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  updateCartUI();
}
function removeItem(id){
  delete cart[id];
  updateCartUI();
}

function cartItemsArray(){
  return Object.entries(cart).map(([id, qty]) => {
    const product = PRODUCTS.find(p => p.id == id);
    return { ...product, qty };
  });
}

function updateCartUI(){
  const items = cartItemsArray();
  const totalQty = items.reduce((s,i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = totalQty;

  const body = document.getElementById('drawerBody');
  if(items.length === 0){
    body.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.<br>Adicione produtos no catálogo.</div>`;
  } else {
    body.innerHTML = items.map(i => `
      <div class="cart-item">
        <div class="cart-item__thumb">${i.img ? `<img src="${i.img}" alt="${i.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : ''}</div>
        <div class="cart-item__info">
          <div class="t">${i.name}</div>
          <div class="p">${formatBRL(i.price)}</div>
          <div class="qty">
            <button onclick="changeQty(${i.id},-1)">−</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${i.id},1)">+</button>
          </div>
        </div>
        <button class="remove-x" onclick="removeItem(${i.id})">Remover</button>
      </div>
    `).join('');
  }

  renderFooter(items);
  saveCartToStorage();
}

function renderFooter(items){
  const subtotal = items.reduce((s,i) => s + i.price * i.qty, 0);
  const fee = items.length ? DELIVERY_FEES[selectedCity] : 0;
  const total = subtotal + fee;

  const foot = document.getElementById('drawerFoot');
  if(items.length === 0){
    foot.innerHTML = '';
    return;
  }

  foot.innerHTML = `
    <button class="btn btn-ghost" style="width:100%;margin-bottom:12px;" onclick="clearCart()">Limpar carrinho</button>

    <div class="field">
      <label>CEP</label>
      <input type="text" id="cepInput" placeholder="00000-000" maxlength="9" autocomplete="postal-code">
      <small class="field-error-text" id="cepError"></small>
    </div>

    <div class="field">
      <label>Cidade de entrega</label>
      <select id="citySelect">
        <option value="fortaleza" ${selectedCity==='fortaleza'?'selected':''}>Fortaleza — Taxa R$ 8,00</option>
        <option value="caucaia" ${selectedCity==='caucaia'?'selected':''}>Caucaia — Taxa R$ 5,00</option>
      </select>
    </div>

    <div class="field">
      <label>Forma de pagamento</label>
      <div class="pay-options">
        <div class="pay-opt ${selectedPayment==='Pix'?'active':''}" data-pay="Pix">Pix</div>
        <div class="pay-opt ${selectedPayment==='Cartão de Crédito/Débito'?'active':''}" data-pay="Cartão de Crédito/Débito">Cartão</div>
      </div>
    </div>

    <div class="field">
      <label>Nome completo</label>
      <input type="text" id="custName" placeholder="Seu nome">
    </div>
    <div class="field">
      <label>Bairro / Endereço completo</label>
      <input type="text" id="custAddress" placeholder="Rua, número, bairro, referência">
    </div>
    <div class="field">
      <label>Observações (opcional)</label>
      <textarea id="custNotes" placeholder="Cor, horário de entrega, etc."></textarea>
    </div>

    <div class="summary-row"><span>Subtotal</span><span>${formatBRL(subtotal)}</span></div>
    <div class="summary-row"><span id="deliveryLabel">Entrega (${selectedCity==='fortaleza'?'Fortaleza':'Caucaia'})</span><span id="deliveryFee">${formatBRL(fee)}</span></div>
    <div class="summary-row total"><span>Total</span><span id="totalPrice" class="price">${formatBRL(total)}</span></div>

    <button class="btn btn-wa" style="width:100%;margin-top:14px;" onclick="checkoutWhatsApp()">
      Finalizar Pedido no WhatsApp
    </button>
  `;

  document.getElementById('citySelect').addEventListener('change', e => {
    selectedCity = e.target.value;
    renderFooter(cartItemsArray());
    saveCartToStorage();
  });
  const cepInput = document.getElementById('cepInput');
  if (cepInput){
    cepInput.value = storedCEP;
    cepInput.addEventListener('input', e => {
      const formatted = formatCEP(e.target.value);
      if (formatted !== e.target.value) e.target.value = formatted;
      storedCEP = formatted;

      const { valid, message, city } = validateCEP(formatted);
      if (valid){
        setCEPError('');
        if (city && city !== selectedCity){
          selectedCity = city;
          renderFooter(cartItemsArray());
        }
      } else if (formatted){
        setCEPError(message);
      } else {
        setCEPError('');
      }

      saveCartToStorage();
    });
    cepInput.addEventListener('blur', e => {
      const { valid, message } = validateCEP(e.target.value);
      if (!valid && e.target.value.trim()) {
        setCEPError(message);
      } else if (valid) {
        setCEPError('');
      }
    });
  }
  document.querySelectorAll('.pay-opt').forEach(el => {
    el.addEventListener('click', () => {
      selectedPayment = el.dataset.pay;
      renderFooter(cartItemsArray());
      saveCartToStorage();
    });
  });
}

function checkoutWhatsApp(){
  const items = cartItemsArray();
  if(items.length === 0){ alert('Seu carrinho está vazio.'); return; }

  const name = document.getElementById('custName').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const cep = document.getElementById('cepInput').value.trim();
  const notes = document.getElementById('custNotes').value.trim();

  const cepState = validateCEP(cep);
  if (cep && !cepState.valid){
    setCEPError(cepState.message);
    alert('Por favor, corrija o CEP antes de finalizar o pedido.');
    return;
  }

  if(!name || !address){
    alert('Por favor, preencha seu nome e endereço completo antes de finalizar.');
    return;
  }

  const subtotal = items.reduce((s,i) => s + i.price * i.qty, 0);
  const fee = DELIVERY_FEES[selectedCity];
  const total = subtotal + fee;
  const cityLabel = selectedCity === 'fortaleza' ? 'Fortaleza' : 'Caucaia';

  let msg = `*NOVO PEDIDO - SZ IMPORTS*\n\n`;
  msg += `*Itens:*\n`;
  items.forEach(i => {
    msg += `• ${i.qty}x ${i.name} — ${formatBRL(i.price)} (un.) = ${formatBRL(i.price*i.qty)}\n`;
  });
  msg += `\n*Subtotal:* ${formatBRL(subtotal)}`;
  msg += `\n*Entrega (${cityLabel}):* ${formatBRL(fee)}`;
  msg += `\n*Total:* ${formatBRL(total)}`;
  msg += `\n\n*Forma de pagamento:* ${selectedPayment}`;
  msg += `\n\n*Dados para entrega:*`;
  msg += `\nNome: ${name}`;
  msg += `\nEndereço/Bairro: ${address}`;
  if(notes) msg += `\nObservações: ${notes}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function openCart(){
  document.getElementById('overlay').classList.add('show');
  document.getElementById('drawer').classList.add('show');
}
function closeCart(){
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('drawer').classList.remove('show');
}

function renderFaq(){
  const list = document.getElementById('faqList');
  list.innerHTML = FAQS.map((f,idx) => `
    <div class="faq-item" data-idx="${idx}">
      <button class="faq-q">
        ${f.q}
        <span class="chev">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </button>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join('');

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

function renderFeedback(){
  const list = document.getElementById('feedbackList');
  list.innerHTML = FEEDBACKS.map(f => `
    <article class="feedback-card">
      <p>“${f.text}”</p>
      <div class="author">
        <div class="avatar">${f.author.charAt(0)}</div>
        <div class="author-info">
          <strong>${f.author}</strong>
          <span>${f.location}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function viewHighlightProduct(){
  const card = document.querySelector(`[data-product-id="${HIGHLIGHT_PRODUCT_ID}"]`);
  if(card){
    card.scrollIntoView({ behavior:'smooth', block:'center' });
    card.classList.add('highlight-target');
    setTimeout(() => card.classList.remove('highlight-target'), 1400);
  } else {
    document.getElementById('produtos').scrollIntoView({ behavior:'smooth' });
  }
}

function orderHighlightProduct(){
  const product = PRODUCTS.find(p => p.id === HIGHLIGHT_PRODUCT_ID);
  if(!product){
    alert('Produto em destaque não encontrado.');
    return;
  }

  const msg = `*NOVO PEDIDO - SZ IMPORTS*\n\n` +
    `*Item:*\n` +
    `• 1x ${product.name} — ${formatBRL(product.price)}\n\n` +
    `*Total:* ${formatBRL(product.price)}\n` +
    `\n*Forma de pagamento:* Pix ou Cartão\n` +
    `\n*Dados para entrega:*\nNome: \nEndereço/Bairro: \nObservações: `;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function toggleMobileNav(){
  const navLinks = document.querySelector('.nav__links');
  const button = document.querySelector('.nav__menu-btn');
  const isOpen = navLinks.classList.toggle('mobile-open');
  button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

document.addEventListener('click', e => {
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav__links');
  const button = document.querySelector('.nav__menu-btn');
  if (navLinks.classList.contains('mobile-open') && !nav.contains(e.target)) {
    navLinks.classList.remove('mobile-open');
    button.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav__links').classList.remove('mobile-open');
    document.querySelector('.nav__menu-btn').setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  loadCartFromStorage();
  renderProducts();
  renderFaq();
  renderFeedback();
  updateCartUI();

  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  if (searchInput){
    searchInput.value = catalogState.search;
    searchInput.addEventListener('input', e => {
      catalogState.search = e.target.value;
      renderProducts();
    });
  }
  if (sortSelect){
    sortSelect.value = catalogState.sort;
    sortSelect.addEventListener('change', e => {
      catalogState.sort = e.target.value;
      renderProducts();
    });
  }

  setTimeout(showProofToast, 3000);
  setInterval(showProofToast, 15000);
});

const PROOF_EVENTS = [
  { city:'Caucaia', product:'Fone Sem Fio Gamer LEF-G7S' },
  { city:'Fortaleza', product:'TURBO Kit Carregador 25W' },
  { city:'Fortaleza', product:'Smartwatch Inteligente' },
  { city:'Caucaia', product:'Fone Sem Fio i12 Bluetooth 5.3' },
  { city:'Fortaleza', product:'Game Stick 4K HDMI' },
  { city:'Caucaia', product:'Headphone Sem Fio P9' },
  { city:'Fortaleza', product:'Carregador Rápido 5.1A + PD' },
  { city:'Caucaia', product:'Fone de Ouvido USB-C Tipo-C' },
];

function showProofToast(){
  const ev = PROOF_EVENTS[Math.floor(Math.random() * PROOF_EVENTS.length)];
  const minsAgo = Math.floor(Math.random() * 12) + 1;
  const container = document.getElementById('proofContainer');

  const toast = document.createElement('div');
  toast.className = 'proof-toast';
  toast.innerHTML = `
    <span class="dot"></span>
    <div class="txt">Alguém em <b>${ev.city}</b> acabou de pedir <b>${ev.product}</b>
      <span class="time">há ${minsAgo} min</span>
    </div>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 5200);
}
