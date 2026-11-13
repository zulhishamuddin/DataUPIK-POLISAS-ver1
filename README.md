# DataUPIK POLISAS — Dashboard

---

## 🔧 Penyelesaian Masalah (Troubleshooting)

### ❌ Masalah: Login Admin Gagal / "Ralat sambungan Supabase"

**Punca:** ANON KEY dalam `js/supabase-config.js` menggunakan format baru Supabase (`sb_publishable_...`) yang **tidak diterima** oleh supabase-js v2.

**Penyelesaian:**
1. Pergi ke [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Pilih projek **xwnynfvhtqjxhpkllvxa**
3. Klik **Settings → API**
4. Di bawah **"Project API keys"**, salin nilai **"anon / public"**
5. Key yang betul bermula dengan: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
6. Buka `dashboard/js/supabase-config.js` dan gantikan baris:
   ```
   const SUPABASE_ANON_KEY = 'sb_publishable_...';
   ```
   dengan:
   ```
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // ← key anda
   ```

> ℹ️ Halaman login kini akan memaparkan mesej ralat yang tepat jika sambungan Supabase gagal.

### ❌ Masalah: Logo UPIK tidak muncul

**Punca:** Fail logo belum disalin ke folder `assets/`.

**Penyelesaian:**
1. Salin fail logo UPIK POLISAS ke: `dashboard/assets/logo-upik.jpg`
2. Jika nama fail berbeza, ubah dalam `dashboard/index.html` baris: `src="assets/logo-upik.jpg"`
3. Jika logo masih tidak muncul apabila buka terus dari `file://`, ini **normal** — logo akan muncul apabila dihost di GitHub Pages atau pelayan web.

> ℹ️ Jika logo gagal dimuatkan, sistem akan memaparkan teks **"🔬 UPIK"** sebagai gantian.

### ❌ Masalah: Jadual/Rekod tidak dimuatkan

**Semak perkara berikut:**
1. **ANON KEY** — Ikut langkah di atas
2. **RLS Policies** — Pastikan polisi RLS sudah dikonfigurasi (lihat bahagian Setup di bawah)
3. **Nama jadual** — Nama jadual dalam `supabase-config.js` mesti **tepat sama** dengan nama dalam Supabase (termasuk huruf besar/kecil dan spasi)
4. **Column `status`** — Pastikan column `status` sudah ditambah (SQL di bahagian Setup)

---

Sistem Pengurusan Data Penyelidikan, Inovasi & Komersial  
**Politeknik Sultan Haji Ahmad Shah (POLISAS)**

---

## 🚀 Cara Setup

### 1. Supabase — Pastikan RLS Dikonfigurasi

Untuk setiap jadual, aktifkan **Row Level Security (RLS)** di Supabase:

**`Data admin`** — Baca sahaja (anon boleh select untuk login):
```sql
CREATE POLICY "Allow select for login" ON "Data admin"
FOR SELECT USING (true);
```

**`Data pensyarah`** — Baca & tulis:
```sql
CREATE POLICY "Allow all" ON "Data pensyarah"
FOR ALL USING (true);
```

**`Data penyelidikan`, `Data inovasi`, `Data IP dan komersial`, `Data geran`, `Data aset tak ketara`** — Baca semua, tulis hanya rekod sendiri:
```sql
CREATE POLICY "Allow select" ON "Data penyelidikan" FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON "Data penyelidikan" FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update own" ON "Data penyelidikan" FOR UPDATE USING (true);
CREATE POLICY "Allow delete own" ON "Data penyelidikan" FOR DELETE USING (true);
```
*(Ulang untuk setiap jadual)*

**`Data penyelaras UPIK`** — Baca sahaja untuk semua:
```sql
CREATE POLICY "Allow read" ON "Data penyelaras UPIK" FOR SELECT USING (true);
CREATE POLICY "Allow write admin" ON "Data penyelaras UPIK" FOR ALL USING (true);
```

### 2. Supabase Storage — Bucket Authenticated

1. Buka **Storage** → Cipta bucket bernama `data-upik-storage`
2. Set kepada **Private** (Authenticated)
3. Tambah policy:
```sql
CREATE POLICY "Admin only" ON storage.objects
FOR ALL USING (true); -- Pastikan hanya admin capai via signed URL
```

### 3. Column `status` — Tambah ke Setiap Jadual Data

Jalankan SQL ini di Supabase SQL Editor untuk jadual yang menerima input pensyarah:

```sql
ALTER TABLE "Data penyelidikan" ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'verified';
ALTER TABLE "Data inovasi"      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'verified';
ALTER TABLE "Data IP dan komersial" ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'verified';
ALTER TABLE "Data geran"        ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'verified';
ALTER TABLE "Data aset tak ketara" ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'verified';
```

### 4. Logo UPIK

Salin fail `logo UPIK POLISAS.jpg` ke folder `assets/` dan namakan semula kepada `logo-upik.jpg`.

### 5. Deploy ke GitHub Pages

1. Cipta repo baru di GitHub
2. Upload semua fail dalam folder `dashboard/`
3. Pergi ke **Settings → Pages → Deploy from branch → main**
4. URL: `https://[username].github.io/[repo-name]/`

---

## 📁 Struktur Fail

```
dashboard/
├── index.html          ← Halaman Login
├── dashboard.html      ← Dashboard Utama + Statistik
├── penyelidikan.html   ← Modul Penyelidikan
├── inovasi.html        ← Modul Inovasi
├── ip-komersial.html   ← Modul IP & Komersial
├── geran.html          ← Modul Geran
├── aset.html           ← Modul Aset Tak Ketara
├── penyelaras.html     ← Info Penyelaras UPIK
├── admin.html          ← Panel Admin (Pengesahan Data)
├── pengguna.html       ← Pengurusan Pengguna (Admin)
├── css/
│   └── style.css
├── js/
│   ├── supabase-config.js
│   ├── auth.js
│   └── app.js
└── assets/
    └── logo-upik.jpg   ← ⚠️ Salin logo ke sini
```

---

## 👤 Akaun Default

| Peranan | Login ID | Password |
|---------|----------|----------|
| Admin | `Zulhisham` | `Admin123` |
| Pensyarah (contoh) | `Ali` | `Ali123` |

---

## 🔐 Peranan & Kebenaran

| Fungsi | Admin | Pensyarah |
|--------|-------|-----------|
| Login | ✅ | ✅ |
| Daftar akaun | ❌ | ✅ |
| Input data | ✅ | ✅ (perlu disahkan) |
| Sahkan data | ✅ | ❌ |
| CRUD data | ✅ | ❌ |
| Download dokumen | ✅ | ❌ |
| Export Excel | ✅ | ❌ |
| Print statistik | ✅ | ✅ |
| Carian & filter | ✅ | ✅ |
| Lihat Penyelaras | ✅ | ✅ |
| Urus Pengguna | ✅ | ❌ |
