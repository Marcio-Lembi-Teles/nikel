const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = { transactions: [] };

console.log('transactions.js carregado', { logged, session });

const btnLogout = document.getElementById("button-logout");
if (btnLogout) btnLogout.addEventListener("click", logout);

// safe form listener: só adiciona se existir
const transForm = document.getElementById("transaction-form");
if (transForm) {
  transForm.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log('transaction-form submit handler running');

    const value = parseFloat(document.getElementById("value-input").value) || 0;
    const description = document.getElementById("description-input").value || "";
    const date = document.getElementById("date-input").value || "";
    const typeEl = document.querySelector('input[name="type-input"]:checked');
    const type = typeEl ? typeEl.value : "1";

    const newTx = { value, description, date, type };

    const storageKey = sessionStorage.getItem('logged') || localStorage.getItem('session') || logged || session;
    if (!storageKey) {
      console.error('Nenhuma sessão (storageKey) encontrada. Abortando.');
      alert('Erro: usuário não logado. Faça login novamente.');
      return;
    }

    let userData = localStorage.getItem(storageKey);
    userData = userData ? JSON.parse(userData) : { login: storageKey, password: '', transactions: [] };
    if (!Array.isArray(userData.transactions)) userData.transactions = [];

    userData.transactions.unshift(newTx);
    localStorage.setItem(storageKey, JSON.stringify(userData));

    // atualiza var local e UI
    data = userData;
    console.log('Transação salva em localStorage', storageKey, newTx);

    transForm.reset();
    try { const inst = bootstrap.Modal.getInstance(document.getElementById('transaction-modal')); if (inst) inst.hide(); } catch (err) {}

    // atualiza renderizações
    try { renderTransactions(); updateTotals(); getTransactions(); } catch (err) { console.warn('Render funcs não disponíveis:', err); }

    alert('Lançamento adicionado com sucesso!');
  });

  // fallback: se o botão de submit estiver fora do form, liga o click para disparar o submit
  const submitBtn = document.querySelector('#transaction-modal .modal-footer button[type="submit"], #transaction-modal .modal-footer .button-default, #transaction-modal .modal-footer .btn-primary');
  if (submitBtn) {
    submitBtn.addEventListener('click', function(ev){
      ev.preventDefault();
      transForm.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));
    });
  }
} else {
  console.warn('transaction-form não encontrado na página.');
}

checkLogged();

function checkLogged() {
  if (session) {
    sessionStorage.setItem("logged", session);
    logged = session;
  }

  if (!logged) {
    console.warn("Usuário não logado, redirecionando...");
    window.location.href = 'index.html';
    return;
  }

  const dataUser = localStorage.getItem(logged);
  if (dataUser) {
    data = JSON.parse(dataUser);
  }

  console.log("checkLogged -> data carregada:", data);

  // renderiza ao carregar a página
  try { renderTransactions(); updateTotals(); getTransactions(); } catch (err) { /* permissivo */ }
}

function logout() {
  sessionStorage.removeItem("logged");
  localStorage.removeItem("session");
  window.location.href = 'index.html';
}

/* ---------- RENDER / UTILS ---------- */

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function updateTotals() {
  const txs = data.transactions || [];
  const inTotal = txs.filter(t => t.type === "1").reduce((s, t) => s + Number(t.value || 0), 0);
  const outTotal = txs.filter(t => t.type === "2").reduce((s, t) => s + Number(t.value || 0), 0);

  const totalEl = document.getElementById('total-balance');
  const inEl = document.getElementById('cash-in-total');
  const outEl = document.getElementById('cash-out-total');

  if (inEl) inEl.textContent = formatCurrency(inTotal);
  if (outEl) outEl.textContent = formatCurrency(outTotal);
  if (totalEl) totalEl.textContent = formatCurrency(inTotal - outTotal);
}

function renderTransactions() {
  const listIn = document.getElementById('cash-in-list');
  const listOut = document.getElementById('cash-out-list');

  if (!listIn && !listOut) return;

  const txs = (data && data.transactions) ? data.transactions : [];

  if (listIn) listIn.innerHTML = '';
  if (listOut) listOut.innerHTML = '';

  txs.forEach(tx => {
    const item = document.createElement('div');
    item.className = 'transaction-item d-flex justify-content-between align-items-start py-2';

    const left = document.createElement('div');
    left.innerHTML = `<div class="fw-semibold">${escapeHtml(tx.description || '')}</div><div class="small text-muted">${escapeHtml(tx.date || '')}</div>`;

    const right = document.createElement('div');
    right.textContent = formatCurrency(Number(tx.value) || 0);
    right.className = tx.type === "1" ? 'text-success' : 'text-danger';

    item.appendChild(left);
    item.appendChild(right);

    if (tx.type === "1") {
      if (listIn) listIn.appendChild(item);
    } else {
      if (listOut) listOut.appendChild(item);
    }
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])});
}

function getTransactions() {
  const transactions = data.transactions || [];
  let transactionsHtml = '';

  if (transactions.length) {
    transactions.forEach((item) => {
      const type = item.type === "2" ? "Saída" : "Entrada";
      transactionsHtml += `
        <tr>
          <th scope="row">${escapeHtml(item.date || '')}</th>
          <td>${Number(item.value || 0).toFixed(2)}</td>
          <td>${type}</td>
          <td>${escapeHtml(item.description || '')}</td>
        </tr>
      `;
    });
  } else {
    transactionsHtml = '<tr><td colspan="4" class="text-center">Nenhuma transação cadastrada.</td></tr>';
  }

  const container = document.getElementById("transactions-list");
  if (container) container.innerHTML = transactionsHtml;
}