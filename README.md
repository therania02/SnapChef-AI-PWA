# 🍳 SnapChef AI - Smart Cooking Assistant & Food Waste Solution

Nama Tim: Four-Leaf Clovers
Anggota Tim:
1. 241111021 - Sastrawan
2. 241112087 - Carita Angel Samudra Tjoatja
3. 241112584 - Therania
4. 241112659 - Steven Lienardi

---

SnapChef AI adalah platform **Progressive Web App (PWA)** inovatif yang menggabungkan *Computer Vision* dan *Generative AI* untuk mentransformasi cara kita mengelola dapur. Aplikasi ini memungkinkan pengguna untuk memfoto bahan makanan sisa dan mengubahnya menjadi resep lezat secara instan.

## 💡 1. Ide Project
Project ini dikembangkan untuk menjawab tantangan *Food Waste* rumah tangga. Dengan mendeteksi bahan makanan secara real-time, SnapChef AI membantu pengguna:
1. Mengolah stok bahan yang ada menjadi masakan bernilai tinggi.
2. Memastikan asupan nutrisi terjaga melalui analisis AI yang personal.
3. Mempermudah belanja kebutuhan dapur yang terintegrasi dengan e-commerce.

---

## 🛠️ 2. Teknologi & Aplikasi yang Digunakan

### 🌐 Frontend
- **React (Vite)** → Framework utama untuk membangun UI yang cepat dan modular.
- **Tailwind CSS** → Styling modern berbasis utility-first untuk desain responsif.
- **Progressive Web App (PWA)** → Agar aplikasi bisa diinstal seperti aplikasi native.
- **Context API** → State management global (User, Preferences, Favorites).

### 🔐 Backend & Database
- **Node.js (Express)** → Backend server & REST API.
- **MySQL** → Database utama untuk menyimpan data pengguna, resep, dan aktivitas.
- **Sequelize ORM** → Manajemen database dan query yang terstruktur.

### 🔐 Authentication System
- **JWT (JSON Web Token)** → Login & session management yang aman.
- **Password Hashing (bcrypt)** → Keamanan password pengguna.

### 🤖 Artificial Intelligence
- **Google Gemini API (Vision Model)** → Deteksi bahan makanan dari gambar.
- **Google Gemini API (Generative AI)** → Generate resep otomatis berbasis bahan.
- **Prompt Engineering** → Menghasilkan resep yang relevan dan berkualitas.

### 📸 Device & API Integration
- **Web Camera API** → Akses kamera langsung dari browser.
- **File Upload API** → Upload gambar dari galeri perangkat.

### 💳 Payment & Monetization
- **Midtrans (Sandbox API)** → Simulasi sistem pembayaran untuk fitur premium.

### 🛒 Integrasi Eksternal
- **Shopee Affiliate Links** → Pembelian bahan langsung dari aplikasi.

### ⚙️ Deployment & Tools
- **Vercel / Netlify** → Hosting dan deployment aplikasi.
- **Figma** → Desain UI/UX dan prototyping.
- **Git & GitHub** → Version control dan kolaborasi tim.

---

## ⚙️ 3. Setup Guide

### 1. Setup Database MySQL
1. Buat database baru di MySQL dengan nama `snapchef_db`.
2. Ubah password untuk bagian development sesuai dengan password MySQL (root) di file backend/config/config.js

### 2. Setup Environment Variables
1. Buat file .env di masing-masing folder frontend dan backend

- ISI file .env frontend:
VITE_GEMINI_API_KEY=
VITE_JWT_SECRET=rahasia_snapchef_2026
VITE_FIREBASE_API_KEY=AIzaSyBlOJpzKE3Ez3loiQul0iR5kK7tNzQmemc  

- ISI file .env backend:
GEMINI_API_KEY=AIzaSyAMUqZrststpYrtbSRDI9csfBehAUYEaRk
JWT_SECRET=rahasia_snapchef_2026
VITE_FIREBASE_API_KEY=AIzaSyBlOJpzKE3Ez3loiQul0iR5kK7tNzQmemc  

### 3. Setup Backend Node.js
1. Masuk ke folder `backend`: `cd backend`
2. Install dependencies: `npm install`
3. Jalankan migrasi tabel: `npx sequelize-cli db:migrate`
4. Jalankan seeder data awal: `npx sequelize-cli db:seed:all`
5. Jalankan server: `npm run dev` atau `node app.js`
   Server akan berjalan di `http://localhost:3000`

### 4. Setup Frontend React
1. Buka terminal baru dan masuk ke folder `frontend`: `cd frontend`
2. Install dependencies: `npm install`
3. Jalankan aplikasi: `npm run dev`
   Aplikasi akan berjalan di `http://localhost:5173`

---

## Akun Uji Coba (Test Account)
Gunakan kredensial berikut untuk menguji aplikasi:
- Email: dosen@mikroskil.ac.id
- Password: password123

---

## API Endpoints

### Global Query Params (Semua GET List)
Gunakan query berikut untuk semua endpoint list:

- `page` → nomor halaman (default: 1)
- `limit` → jumlah data per halaman (default: 10)
- `q` → keyword pencarian (optional)

Contoh: GET /api/recipes?page=1&limit=5&q=ayam

## RESOURCE 1: RECIPES

- GET /api/recipes
- GET /api/recipes?page=1&limit=10&q=nasi&userId=1
- GET /api/recipes/:id
- POST /api/recipes/scan
- POST /api/recipes/save
- PUT /api/recipes/:id/rating
- DELETE /api/recipes/:id

### Body POST /api/recipes/scan
{
  "imageBase64": "data:image/jpeg;base64,...",
  "preferences": "makanan sehat"
}

### Body POST /api/recipes/save
{
  "title": "Nasi Goreng Spesial",
  "ingredients": "2 piring nasi\n1 telur\n2 siung bawang putih\nKecap secukupnya",
  "instructions": "1. Tumis bawang putih\n2. Masukkan telur\n3. Tambahkan nasi dan kecap\n4. Aduk rata",
  "calories": 400,
  "protein": 12,
  "carbs": 50,
  "prepTime": 20
}

### Body PUT /api/recipes/:id/rating
{
  "rating": 5
}

## RESOURCE 2: AUTH & USERS

### AUTH
- POST /api/register
- POST /api/login

### USERS
- GET /api/users
- GET /api/users?page=1&limit=10&q=dosen
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### Body POST /api/register
{
  "name": "User Baru",
  "email": "userbaru@email.com",
  "password": "password123"
}

### Body POST /api/login
{
  "email": "dosen@mikroskil.ac.id",
  "password": "password123"
}

### Body PUT /api/users/:id
{
  "name": "Nama Update",
  "role": "user"
}

## RESOURCE 3: INGREDIENTS

- GET /api/ingredients
- GET /api/ingredients?page=1&limit=10&q=telur
- GET /api/ingredients/:id
- POST /api/ingredients
- PUT /api/ingredients/:id
- DELETE /api/ingredients/:id

### Body POST /api/ingredients
{
  "name": "Bawang Merah",
  "amount": 10,
  "unit": "butir"
}

### Body PUT /api/ingredients/:id
{
  "name": "Bawang Merah Update",
  "amount": 15,
  "unit": "butir"
}

## RESOURCE 4: COMMENTS

- GET /api/comments
- GET /api/comments?page=1&limit=10
- GET /api/comments?postId=1
- GET /api/comments/:id
- POST /api/comments
- PUT /api/comments/:id
- DELETE /api/comments/:id

### Body POST /api/comments
{
  "text": "Resepnya simpel dan enak!",
  "postId": 1
}

### Body PUT /api/comments/:id
{
  "text": "Komentar sudah diupdate menjadi lebih bagus"
}

## RESOURCE 5: POSTS

- GET /api/posts
- GET /api/posts?page=1&limit=10&q=nasi
- GET /api/posts/:id 
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id

### Body POST /api/posts
{
  "recipeName": "Mie Goreng",
  "description": "Menu cepat saji favorit!",
  "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
  "privacy": "public"
}

### Body PUT /api/posts/:id
{
  "recipeName": "Mie Goreng Special Update",
  "description": "Deskripsi postingan sudah diperbarui",
  "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
  "privacy": "private"
}

---

## 🚀 4. Daftar Detail Fitur 

### 🔐 A. Authentication & Smart Profile
1. **SSO Google Login:** Login instan menggunakan akun Google.
2. **Google Account Picker:** Pemilihan akun Google eksplisit bagi pengguna multi-akun.
3. **Dietary Profile Setup:** Konfigurasi preferensi diet (Halal, Vegan, Alergi) sejak awal.
4. **Account Management:** Pengaturan data pribadi, password, dan preferensi akun.

### 📸 B. AI Vision & Ingredient Recognition
5. **AI Ingredient Scanner (Camera):** Akses kamera langsung untuk scan bahan.
6. **AI Ingredient Scanner (Upload):** Unggah foto dari galeri perangkat.
7. **Real-time Detection Display:** Visualisasi label nama bahan hasil deteksi AI.
8. **Scan History Tracking:** Riwayat pemindaian bahan makanan untuk penggunaan kembali.

### 🧠 C. Advanced AI Recipe Engine
9. **Dynamic Recipe Generation:** Pembuatan resep unik berbasis kombinasi bahan yang terdeteksi.
10. **Recipe Detail View:** Informasi porsi, estimasi waktu, dan level kesulitan.
11. **Ingredient Substitutes:** Rekomendasi bahan alternatif jika ada stok yang kosong.
12. **AI Taste Tweaker:** Fitur modifikasi resep instan (contoh: "Ubah ke versi Pedas").
13. **AI Chat Sous-Chef:** Chatbot asisten masak yang siap menjawab pertanyaan teknis.
14. **Nutrition Information:** Analisis kalori, protein, lemak, dan karbohidrat per resep.
15. **Portion Scaler:** Kalkulator takaran bahan otomatis jika jumlah porsi diubah.
16. **Recipe Filtering:** Filter otomatis resep berdasarkan profil diet pengguna.
17. **AI Creative Title:** Penamaan judul resep yang estetik oleh AI.
18. **Instruction Timer:** Timer otomatis yang terintegrasi pada langkah instruksi masak.

### 📖 D. Kitchen Management & Collection
19. **Personal Cookbook:** Koleksi resep pribadi hasil racikan AI.
20. **Favorites System:** Penandaan resep pilihan untuk akses cepat.
21. **Recipe Rating & Review:** Sistem catatan dan penilaian pribadi setelah memasak.
22. **Smart Shopping List:** Daftar belanja otomatis untuk bahan yang belum tersedia.
23. **Auto Add-to-Cart:** Memasukkan item belanjaan ke daftar belanja otomatis.
24. **Ingredient Availability Check:** Indikator visual stok tersedia vs stok yang harus dibeli.
25. **Search & Sorting:** Pencarian resep berdasarkan popularitas atau waktu.

### 👥 E. Social & Community Hub
26. **Cooking Posts Gallery:** Feed inspirasi masakan dari komunitas SnapChef.
27. **Image Post Upload:** Berbagi dokumentasi hasil masakan ke galeri publik.
28. **Post Privacy Control:** Pengaturan visibilitas postingan (Publik / Teman / Privat).
29. **Community Feedback:** Sistem reaksi dan interaksi komentar pada postingan.
30. **Messaging System:** Fitur pesan instan pribadi antar pengguna.
31. **Cooking Group Chat:** Diskusi grup berdasarkan topik masakan.
32. **Delete & Edit Post:** Manajemen konten postingan yang telah diunggah.
33. **Post Filtering:** Penyaringan konten galeri berdasarkan kategori.
34. **User Mentions:** Fitur menandai rekan dalam diskusi resep.

### 💎 F. Monetization & Premium Experience
35. **Daily Scan Limit:** Batas penggunaan 3x scan gratis per hari untuk user standar.
36. **Premium Subscription System:** Skema berlangganan untuk akses fitur eksklusif.
37. **Payment Gateway Integration:** Simulasi pembayaran aman (Sandbox) melalui Midtrans.
38. **Premium Badge Identification:** Identitas khusus pada profil pengguna premium.
39. **Unlimited Scans:** Akses penuh pemindaian tanpa batasan harian.
40. **Affiliate Grocery Links:** Integrasi tombol belanja langsung ke Shopee.

### ✨ G. UI/UX & Technical Implementation
41. **Bottom Navigation Bar:** Navigasi utama yang ergonomis dan modern.
42. **Swipe Gestures:** Transisi antar halaman menggunakan gerakan geser.
43. **Smooth Micro-Animations:** Animasi halus pada elemen tombol dan transisi.
44. **Toast Notifications:** Feedback visual instan untuk setiap aksi pengguna.
45. **Progress Indicators:** Visualisasi penggunaan kuota scan harian.
46. **Responsive Design:** Optimalisasi tampilan untuk HP, Tablet, dan Desktop.
47. **PWA - Add to Home Screen:** Aplikasi dapat diinstal langsung dari browser.
48. **Dark & Light Mode:** Pengaturan tema tampilan visual sesuai kenyamanan.
49. **Multi-language Support:** Dukungan Bahasa Indonesia dan Bahasa Inggris.
50. **User Context Provider:** Manajemen status global data pengguna (State Management).
51. **Preferences Context:** Sinkronisasi pengaturan profil diet di seluruh fitur.
52. **Favorites Context:** Sinkronisasi data resep tersimpan secara real-time.
53. **Cooking Mode UI:** Antarmuka khusus yang fokus pada langkah instruksi per layar.
54. **Help Center & FAQ:** Pusat informasi dan panduan penggunaan aplikasi.
55. **Privacy Policy Page:** Penjelasan mengenai keamanan data pengguna.
56. **Terms & Conditions:** Aturan dan kebijakan penggunaan platform.
57. **Feedback Form:** Formulir laporan kendala teknis atau saran fitur.
58. **App Performance Optimization:** Sistem caching untuk akses aplikasi yang ringan.

---

## 📅 5. Timeline Pengembangan (Fast-Track Sprint)

| Sprint | Durasi | Fokus Utama | Status |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | 16 Mar – 22 Mar | Project Setup & Authentication | ✅ Done |
| **Sprint 2** | 23 Mar – 29 Mar | AI Vision Scanner Core | ✅ Done |
| **Sprint 3** | 30 Mar – 05 Apr | AI Recipe Engine & Diet Logic | ✅ Done |
| **Sprint 4** | 06 Apr – 12 Apr | Kitchen Tools & Interactive Cooking | 🔄 In Progress |
| **Sprint 5** | 13 Apr – 19 Apr | Social Hub & Smart Shopping List | 🕒 Planned |
| **Sprint 6** | 20 Apr – 26 Apr | Monetization & Premium Features | 🕒 Planned |
| **Sprint 7** | 27 Apr – 04 Mei | Final Polish & PWA Deployment | 🕒 Planned |

---

## 📋 5. Detail Sprint Breakdown

### 🟢 Sprint 1 — Project Setup & Authentication
**Goal:** Membangun fondasi aplikasi, desain, dan sistem login.
- **Tasks:**
    - Setup Project (React Vite + Tailwind CSS).
    - Setup folder structure (Modular Architecture).
    - Finalisasi UI/UX Design di Figma.
    - Implementasi JWT Authentication System.
- **Deliverables:**
    - Struktur folder siap pakai & User bisa Login/Register.

### 📸 Sprint 2 — AI Vision Scanner
**Goal:** Implementasi deteksi bahan makanan menggunakan AI.
- **Tasks:**
    - Integrasi API Google Gemini (Vision Model).
    - Implementasi Camera & Gallery Upload API.
    - Logika pemrosesan hasil deteksi bahan.
- **Deliverables:**
    - User bisa foto bahan makanan & AI mengenali daftar bahannya.

### 🍳 Sprint 3 — AI Recipe Engine
**Goal:** Menghasilkan resep otomatis yang personal.
- **Tasks:**
    - Prompt Engineering untuk Recipe Generator.
    - Integrasi Dietary Profile Filter (Halal/Vegan).
    - Pembuatan Recipe Detail Page UI.
- **Deliverables:**
    - Hasil resep muncul berdasarkan bahan sisa secara akurat.

### 🤖 Sprint 4 — Kitchen Tools & Interactive (Current)
**Goal:** Memberikan pengalaman memasak yang interaktif.
- **Tasks:**
    - Pembuatan Step-by-Step Cooking Mode UI.
    - Implementasi Cooking Timer & Portion Scaler.
    - Integrasi AI Sous-Chef Chatbot.
- **Deliverables:**
    - Mode masak layar penuh berfungsi dengan timer aktif.

### 🛒 Sprint 5 — Social Hub & Smart Shopping List
**Goal:** Membangun ekosistem belanja dan komunitas.
- **Tasks:**
    - Pembuatan Cooking Gallery Feed & Post Upload.
    - Fitur Save to Cookbook & Favorites.
    - Logika Smart Shopping List & Affiliate Links.
- **Deliverables:**
    - User bisa berbagi foto masakan & daftar belanja otomatis muncul.

### 💎 Sprint 6 — Monetization & Premium Features
**Goal:** Implementasi sistem bisnis dan akses eksklusif.
- **Tasks:**
    - Integrasi Midtrans API (Sandbox) untuk upgrade Premium.
    - Logika Daily Scan Limit & Badge Premium.
    - Implementasi AI Taste Tweaker (Modifikasi rasa resep).
- **Deliverables:**
    - Sistem langganan berfungsi & fitur AI Premium terbuka.

### ⚙️ Sprint 7 — Final Polish & PWA Deployment
**Goal:** Optimasi performa dan persiapan rilis final (Deadline 4 Mei).
- **Tasks:**
    - Konfigurasi PWA (Manifest & Service Worker).
    - Implementasi Dark/Light Mode.
    - Bug Fixing & Deployment ke Netlify/Vercel.
- **Deliverables:**
    - Aplikasi PWA Live, stabil, dan dapat diinstal di perangkat.
 
---

## DEMO : https://safari-status-23803732.figma.site
