# MGKONSEL Backend

Backend REST API untuk Sistem Manajemen Konseling Sekolah (MGKONSEL).

## Teknologi

- Node.js + Express.js
- MySQL (port 3308)
- Sequelize ORM
- JWT Authentication
- bcryptjs, cors, multer, express-validator

## Langkah Instalasi & Menjalankan

### 1. Pastikan MySQL berjalan di port 3308

Buat database:
```sql
CREATE DATABASE konseling_db;
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Konfigurasi .env
File `.env` sudah dikonfigurasi. Sesuaikan `DB_PASSWORD` jika perlu.

### 4. Jalankan Migration
```bash
npx sequelize db:migrate
```

### 5. Jalankan Seeder
```bash
npx sequelize db:seed:all
```

### 6. Jalankan Server
```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

## Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mgkonsel.com | admin123 |
| Guru BK | bk@mgkonsel.com | bk123 |
| Pembimbing Rayon | rayon@mgkonsel.com | rayon123 |

## Struktur Folder

```
backend/
├── config/
│   └── database.js       # Konfigurasi Sequelize
├── models/               # Model Sequelize
├── controllers/          # Logic bisnis
├── middleware/           # Auth & role check
├── routes/               # Definisi endpoint
├── seeders/              # Data awal
├── migrations/           # Skema database
├── uploads/              # File upload
├── app.js                # Express setup
├── server.js             # Entry point
├── .env                  # Konfigurasi
└── package.json
```

## Endpoint Utama

| Method | Endpoint | Akses |
|--------|----------|-------|
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | All |
| GET | /api/dashboard | All |
| GET/POST/PUT/DELETE | /api/users | Admin |
| GET/POST/PUT/DELETE | /api/rombels | Admin/All |
| GET/POST/PUT/DELETE | /api/rayons | Admin/All |
| GET/POST/PUT/DELETE | /api/students | All |
| GET/POST/PUT/DELETE | /api/categories | Admin/All |
| GET/POST/PUT/DELETE | /api/rooms | Admin/All |
| GET | /api/counseling/requests | All |
| POST | /api/counseling/requests | Pembimbing Rayon |
| PUT | /api/counseling/requests/:id/accept | Guru BK |
| PUT | /api/counseling/requests/:id/reject | Guru BK |
| PUT | /api/counseling/requests/:id/reschedule | Guru BK |
| POST | /api/counseling/schedules | Guru BK |
| POST | /api/counseling/results | Guru BK |
| GET | /api/reports/monthly | Admin/BK |
| GET | /api/reports/annual | Admin/BK |
