// auth.js — DataUPIK POLISAS Authentication

// Save session to localStorage
function saveSession(user) {
  localStorage.setItem('dataupik_user', JSON.stringify(user));
}

// Get current session
function getSession() {
  const data = localStorage.getItem('dataupik_user');
  return data ? JSON.parse(data) : null;
}

// Clear session
function clearSession() {
  localStorage.removeItem('dataupik_user');
}

// Require login — redirect to index if not logged in
function requireAuth() {
  const user = getSession();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

// Require admin — redirect to dashboard if not admin
function requireAdmin() {
  const user = getSession();
  if (!user) { window.location.href = 'index.html'; return null; }
  if (user.role !== 'admin') { window.location.href = 'dashboard.html'; return null; }
  return user;
}

// Logout
function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// Admin Login
async function loginAdmin(loginId, password) {
  const { data, error } = await supabaseClient
    .from(TABLES.admin)
    .select('*')
    .eq('Login ID', loginId)
    .eq('Password', password)
    .single();

  if (error || !data) return { success: false, message: 'Login ID atau Password salah.' };

  saveSession({ role: 'admin', nama: data['Nama'], id: data['ID'] });
  return { success: true };
}

// Pensyarah Login
async function loginPensyarah(loginId, password) {
  const { data, error } = await supabaseClient
    .from(TABLES.pensyarah)
    .select('*')
    .eq('Login ID', loginId)
    .eq('Password', password)
    .single();

  if (error || !data) return { success: false, message: 'Login ID atau Password salah.' };

  saveSession({
    role: 'pensyarah',
    nama: data['Nama'],
    id: data['id'],
    jabatan: data['Jabatan'],
  });
  return { success: true };
}

// Pensyarah Register
async function registerPensyarah(nama, loginId, password, jabatan) {
  // Check if Login ID already exists
  const { data: existing } = await supabaseClient
    .from(TABLES.pensyarah)
    .select('id')
    .eq('Login ID', loginId)
    .single();

  if (existing) return { success: false, message: 'Login ID sudah digunakan.' };

  const newId = 'P' + Date.now();
  const { error } = await supabaseClient
    .from(TABLES.pensyarah)
    .insert([{
      id: newId,
      Nama: nama,
      'Login ID': loginId,
      Password: password,
      Jabatan: jabatan,
      Create_at: new Date().toISOString(),
    }]);

  if (error) return { success: false, message: 'Ralat pendaftaran: ' + error.message };
  return { success: true };
}

// Render top navbar user info
function renderNavUser() {
  const user = getSession();
  if (!user) return;
  const el = document.getElementById('nav-user-info');
  if (el) {
    el.innerHTML = `
      <span class="nav-role-badge ${user.role === 'admin' ? 'badge-admin' : 'badge-pensyarah'}">
        ${user.role === 'admin' ? 'Admin' : 'Pensyarah'}
      </span>
      <span class="nav-username">${user.nama}</span>
      <button class="btn-logout" onclick="logout()">Log Keluar</button>
    `;
  }
}
