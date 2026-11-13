# DataUPIK POLISAS — Dashboard

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
