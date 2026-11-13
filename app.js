// app.js — DataUPIK POLISAS Shared Utilities

// ── Toast notifications ──
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Drawer helpers ──
function openDrawer(id) {
  document.getElementById(id + '-overlay').classList.add('open');
  document.getElementById(id).classList.add('open');
}
function closeDrawer(id) {
  document.getElementById(id + '-overlay').classList.remove('open');
  document.getElementById(id).classList.remove('open');
}

// ── Modal helpers ──
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ── Sidebar mobile toggle ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

// ── Badge helpers ──
function levelBadge(level) {
  if (!level) return '';
  const map = {
    'International': 'badge-intl',
    'National': 'badge-natl',
    'Institution': 'badge-inst',
  };
  const cls = map[level] || 'badge-inst';
  return `<span class="badge ${cls}">${level}</span>`;
}
function yesnoBadge(val) {
  const t = String(val).toUpperCase();
  if (t === 'TRUE' || t === '1' || t === 'YES') return '<span class="badge badge-yes">Ya</span>';
  if (t === 'FALSE' || t === '0' || t === 'NO') return '<span class="badge badge-no">Tidak</span>';
  return val || '—';
}
function achievementBadge(val) {
  if (!val) return '—';
  const map = { 'Gold': 'badge-gold', 'Silver': 'badge-silver', 'Bronze': 'badge-bronze' };
  for (const k in map) {
    if (val.toLowerCase().includes(k.toLowerCase())) return `<span class="badge ${map[k]}">${val}</span>`;
  }
  return `<span class="badge badge-inst">${val}</span>`;
}
function statusBadge(val) {
  if (!val) return '—';
  if (val === 'verified') return '<span class="badge badge-verified">Disahkan</span>';
  if (val === 'pending')  return '<span class="badge badge-pending">Menunggu</span>';
  return val;
}

// ── Escape HTML ──
function esc(str) {
  if (!str) return '—';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Format date ──
function fmtDate(d) {
  if (!d) return '—';
  return d.split('T')[0];
}

// ── Format currency ──
function fmtRm(v) {
  if (!v || v === '0') return '—';
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  if (isNaN(n)) return esc(v);
  return 'RM ' + n.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── SDG tag ──
function sdgTag(val) {
  if (!val) return '—';
  return val.split(',').map(s => s.trim()).filter(Boolean)
    .map(s => `<span class="sdg-tag">${esc(s)}</span>`).join(' ');
}

// ── Get members string ──
function getMembers(row, keys) {
  return keys.map(k => row[k]).filter(Boolean).join(', ') || '—';
}

// ── Populate filter selects ──
function populateYearFilter(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;
  el.innerHTML = '<option value="">Semua Tahun</option>';
  getYearList().forEach(y => el.innerHTML += `<option value="${y}">${y}</option>`);
}
function populateJabatanFilter(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;
  el.innerHTML = '<option value="">Semua Jabatan</option>';
  JABATAN_LIST.forEach(j => el.innerHTML += `<option value="${j.kod}">${j.kod} — ${j.nama}</option>`);
}
function populateSdgFilter(selectId) {
  const el = document.getElementById(selectId);
  if (!el) return;
  el.innerHTML = '<option value="">Semua SDG</option>';
  SDG_LIST.forEach(s => el.innerHTML += `<option value="${s}">${s}</option>`);
}

// ── Paginator ──
class Paginator {
  constructor({ data, pageSize = 15, renderFn, containerId, paginationId, infoId }) {
    this.data = data;
    this.filtered = data;
    this.pageSize = pageSize;
    this.page = 1;
    this.renderFn = renderFn;
    this.containerId = containerId;
    this.paginationId = paginationId;
    this.infoId = infoId;
  }
  setData(data) {
    this.data = data;
    this.filtered = data;
    this.page = 1;
    this.render();
  }
  filter(fn) {
    this.filtered = this.data.filter(fn);
    this.page = 1;
    this.render();
  }
  render() {
    const total = this.filtered.length;
    const pages = Math.ceil(total / this.pageSize) || 1;
    if (this.page > pages) this.page = pages;
    const start = (this.page - 1) * this.pageSize;
    const slice = this.filtered.slice(start, start + this.pageSize);

    const container = document.getElementById(this.containerId);
    if (container) container.innerHTML = this.renderFn(slice);

    const info = document.getElementById(this.infoId);
    if (info) info.textContent = total === 0
      ? 'Tiada rekod'
      : `Menunjukkan ${start + 1}–${Math.min(start + this.pageSize, total)} daripada ${total} rekod`;

    const pg = document.getElementById(this.paginationId);
    if (!pg) return;
    let html = `<button class="page-btn" onclick="window.__pag_${this.containerId}.prev()" ${this.page===1?'disabled':''}>‹ Prev</button>`;
    const maxBtns = 5;
    let s = Math.max(1, this.page - 2), e = Math.min(pages, s + maxBtns - 1);
    if (e - s < maxBtns - 1) s = Math.max(1, e - maxBtns + 1);
    for (let i = s; i <= e; i++) {
      html += `<button class="page-btn ${i === this.page ? 'active' : ''}" onclick="window.__pag_${this.containerId}.goTo(${i})">${i}</button>`;
    }
    html += `<button class="page-btn" onclick="window.__pag_${this.containerId}.next()" ${this.page===pages?'disabled':''}>Next ›</button>`;
    pg.innerHTML = html;
    window[`__pag_${this.containerId}`] = this;
  }
  prev() { if (this.page > 1) { this.page--; this.render(); } }
  next() { const pages = Math.ceil(this.filtered.length / this.pageSize) || 1; if (this.page < pages) { this.page++; this.render(); } }
  goTo(n) { this.page = n; this.render(); }
}

// ── Excel export (SheetJS) ──
function exportExcel(data, filename) {
  if (!window.XLSX) { showToast('SheetJS belum dimuatkan.', 'error'); return; }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, filename + '.xlsx');
  showToast('Excel berjaya diexport!', 'success');
}

// ── PDF print (statistics only) ──
function printStatistik() {
  window.print();
}

// ── Get signed URL for admin document download ──
async function getSignedUrl(bucket, path) {
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .createSignedUrl(path, 120); // 2 min expiry
  if (error) { showToast('Tidak dapat membuka fail: ' + error.message, 'error'); return null; }
  return data.signedUrl;
}

// ── Download file (admin only) ──
async function downloadFile(bucket, filePath, label) {
  const user = getSession();
  if (!user || user.role !== 'admin') {
    showToast('Hanya admin boleh memuat turun dokumen.', 'error');
    return;
  }
  if (!filePath || filePath === '—') { showToast('Tiada fail untuk dimuat turun.', 'error'); return; }
  showToast('Menyediakan fail…', 'info');
  const url = await getSignedUrl(bucket, filePath);
  if (url) {
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.download = label || 'dokumen';
    a.click();
  }
}

// ── Common page init (navbar + sidebar active) ──
function initPage(activeMenu) {
  const user = requireAuth();
  if (!user) return null;
  renderNavUser();

  // Mark active sidebar item
  document.querySelectorAll('.nav-item').forEach(el => {
    if (el.dataset.menu === activeMenu) el.classList.add('active');
    else el.classList.remove('active');
  });

  // Sidebar footer user
  const sf = document.getElementById('sidebar-user-info');
  if (sf) {
    sf.innerHTML = `<strong>${user.nama}</strong><br>
      <span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-pensyarah'}" style="margin-top:4px">
        ${user.role === 'admin' ? 'Admin' : 'Pensyarah'}
      </span>
      ${user.jabatan ? `<br><small>${user.jabatan}</small>` : ''}`;
  }
  return user;
}

// ── Render sidebar HTML (reusable) ──
function sidebarHTML(active) {
  const user = getSession();
  const isAdmin = user && user.role === 'admin';
  return `
  <div class="sidebar-overlay" id="sidebar-overlay" onclick="toggleSidebar()"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <img src="assets/logo-upik.jpg" alt="Logo UPIK" class="sidebar-logo">
      <div class="sidebar-brand">DataUPIK<br>POLISAS</div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Utama</div>
      <a href="dashboard.html" class="nav-item ${active==='dashboard'?'active':''}" data-menu="dashboard">
        <span class="nav-icon">🏠</span> Dashboard
      </a>
      <div class="nav-section-label">Modul Data</div>
      <a href="penyelidikan.html" class="nav-item ${active==='penyelidikan'?'active':''}" data-menu="penyelidikan">
        <span class="nav-icon">🔬</span> Penyelidikan
      </a>
      <a href="inovasi.html" class="nav-item ${active==='inovasi'?'active':''}" data-menu="inovasi">
        <span class="nav-icon">💡</span> Inovasi
      </a>
      <a href="ip-komersial.html" class="nav-item ${active==='ip'?'active':''}" data-menu="ip">
        <span class="nav-icon">🏛️</span> IP &amp; Komersial
      </a>
      <a href="geran.html" class="nav-item ${active==='geran'?'active':''}" data-menu="geran">
        <span class="nav-icon">💰</span> Geran
      </a>
      <a href="aset.html" class="nav-item ${active==='aset'?'active':''}" data-menu="aset">
        <span class="nav-icon">🧾</span> Aset Tak Ketara
      </a>
      <div class="nav-section-label">Maklumat</div>
      <a href="penyelaras.html" class="nav-item ${active==='penyelaras'?'active':''}" data-menu="penyelaras">
        <span class="nav-icon">📞</span> Penyelaras UPIK
      </a>
      ${isAdmin ? `
      <div class="nav-section-label">Admin</div>
      <a href="admin.html" class="nav-item ${active==='admin'?'active':''}" data-menu="admin">
        <span class="nav-icon">⚙️</span> Pengurusan Data
      </a>
      <a href="pengguna.html" class="nav-item ${active==='pengguna'?'active':''}" data-menu="pengguna">
        <span class="nav-icon">👥</span> Pengurusan Pengguna
      </a>` : ''}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user" id="sidebar-user-info"></div>
      <button class="btn-logout-sidebar" onclick="logout()">🚪 Log Keluar</button>
    </div>
  </aside>`;
}

// ── Search bar HTML ──
function searchBarHTML(activeTab) {
  const tabs = [
    { key: 'semua', label: '🔍 Semua' },
    { key: 'penyelidikan', label: '🔬 Penyelidikan' },
    { key: 'inovasi', label: '💡 Inovasi' },
    { key: 'ip', label: '🏛️ Daftar IP' },
    { key: 'geran', label: '💰 Geran' },
    { key: 'aset', label: '🧾 Aset Tak Ketara' },
  ];
  const tabsHtml = tabs.map(t =>
    `<button class="search-tab ${t.key === activeTab ? 'active' : ''}" onclick="handleSearchTab('${t.key}')">${t.label}</button>`
  ).join('');
  return `
  <div class="search-filter-bar">
    <div class="search-tabs">${tabsHtml}</div>
    <div class="search-input-wrap">
      <span class="search-icon">🔍</span>
      <input type="text" class="search-input" id="global-search" placeholder="Cari tajuk, nama, jabatan..." oninput="handleGlobalSearch(this.value)">
    </div>
    <select class="filter-select" id="filter-year" onchange="applyFilters()">
      <option value="">📅 Semua Tahun</option>
    </select>
    <select class="filter-select" id="filter-jabatan" onchange="applyFilters()">
      <option value="">🏢 Semua Jabatan</option>
    </select>
    <select class="filter-select" id="filter-sdg" onchange="applyFilters()">
      <option value="">🌍 Semua SDG</option>
    </select>
  </div>`;
}

// ── Handle search tab navigation ──
function handleSearchTab(tab) {
  const pages = {
    semua: 'dashboard.html',
    penyelidikan: 'penyelidikan.html',
    inovasi: 'inovasi.html',
    ip: 'ip-komersial.html',
    geran: 'geran.html',
    aset: 'aset.html',
  };
  if (pages[tab]) window.location.href = pages[tab];
}

// ── Handle global search (redirect with query) ──
function handleGlobalSearch(val) {
  if (!val) return;
  // Store in session for the target page to use
  sessionStorage.setItem('globalSearch', val);
}
