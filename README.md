# 🍳 SnapChef AI - Smart Cooking Assistant & Food Waste Solution

### Nama Tim: Four-Leaf Clovers
### Anggota Tim:
1. 241111021 - Sastrawan
2. 241112087 - Carita Angel Samudra Tjoatja
3. 241112584 - Therania
4. 241112659 - Steven Lienardi

---

SnapChef AI adalah platform **Progressive Web App (PWA)** inovatif yang menggabungkan *Computer Vision* dan *Generative AI* untuk mentransformasi cara kita mengelola dapur. Aplikasi ini memungkinkan pengguna untuk memfoto bahan makanan sisa dan mengubahnya menjadi resep lezat secara instan.

⚠️ Catatan: Aplikasi ini saat ini dioptimalkan dan hanya dapat berjalan dengan baik pada browser Google Chrome.

---

## 💡 1. Ide Project
Project ini dikembangkan untuk menjawab tantangan *Food Waste* rumah tangga. Dengan mendeteksi bahan makanan secara real-time, SnapChef AI membantu pengguna:
1. Mengolah stok bahan yang ada menjadi masakan bernilai tinggi.
2. Memastikan asupan nutrisi terjaga melalui analisis AI yang personal.
3. Mempermudah belanja kebutuhan dapur yang terintegrasi dengan e-commerce.

---

## 🛠️ 2. Technologies & Tools

### 🌐 Frontend

* **React (Vite)** → Frontend framework untuk membangun antarmuka yang cepat dan modern.
* **Tailwind CSS** → Utility-first CSS framework untuk desain responsif.
* **React Router DOM** → Navigasi antar halaman pada aplikasi.
* **Axios** → HTTP client untuk komunikasi dengan REST API.
* **Progressive Web App (PWA)** → Memungkinkan aplikasi diinstal seperti aplikasi native.
* **Context API** → State management global (User, Preferences, Favorites, Theme).

---

### 🔐 Backend & Database

* **Node.js** → JavaScript runtime untuk backend.
* **Express.js** → Framework REST API.
* **MySQL** → Database utama aplikasi.
* **Sequelize ORM** → ORM untuk manajemen database dan query.

---

### 🔑 Authentication & Security

* **Firebase Authentication** → Google Sign-In.
* **JWT (JSON Web Token)** → Authentication dan Authorization.
* **bcrypt** → Password hashing.
* **CORS** → Pengamanan komunikasi antara frontend dan backend.

---

### 🤖 Artificial Intelligence

* **Google Gemini Vision API** → Deteksi bahan makanan dari gambar.
* **Google Gemini Generative AI** → Pembuatan resep, AI Sous Chef, dan modifikasi resep.
* **Prompt Engineering** → Menghasilkan respons AI yang lebih akurat dan relevan.

---

### 📸 Device & Browser APIs

* **MediaDevices Camera API** → Mengakses kamera perangkat secara langsung.
* **File Upload API** → Mengunggah gambar dari galeri perangkat.

---

### 💬 Real-time Communication

* **Socket.IO** → Real-time messaging dan sinkronisasi percakapan.

---

### 💳 Payment Gateway

* **Midtrans Sandbox API** → Simulasi pembayaran Premium Subscription.

---

### 🛒 Third-party Integration

* **Shopee Affiliate** → Mengarahkan pengguna ke pembelian bahan makanan melalui tautan afiliasi.

---

### ☁️ Media Storage

* **Cloudinary** → Penyimpanan dan pengelolaan gambar pengguna serta postingan.

---

### 🚀 Deployment & Development Tools

* **Railway** → Deployment frontend, backend dan database.
* **Git & GitHub** → Version control dan kolaborasi tim.
* **Figma** → Perancangan UI/UX dan prototyping.

---

## ⚙️ 3. Setup Guide

### 1. Setup Database

1. Pastikan MySQL sudah terinstall dan berjalan.
2. Buat database baru dengan nama:

```text
snapchef_db
```

---

### 2. Setup Environment Variables

Project ini terdiri dari dua bagian, yaitu **frontend** dan **backend**. Buat file `.env` pada masing-masing folder.

### Backend (`backend/.env`)

```env
PORT=3000

GEMINI_API_KEY=AIzaSyD3Ftjyt2wtP0MFN00IHJgmm9ybC9KSmWk
JWT_SECRET=rahasia_snapchef_2026

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_DATABASE=snapchef_db

MIDTRANS_SERVER_KEY=Mid-server-6bih9GLzTDRINz6v1Kojuuz4
MIDTRANS_CLIENT_KEY=Mid-client-r3-Ny5w_dthHnlBQ
MIDTRANS_IS_PRODUCTION=false

FRONTEND_URL=http://localhost:5173

VITE_FIREBASE_API_KEY=AIzaSyBlOJpzKE3Ez3loiQul0iR5kK7tNzQmemc  
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000

VITE_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
VITE_GEMINI_API_KEY=AIzaSyD3Ftjyt2wtP0MFN00IHJgmm9ybC9KSmWk
VITE_FIREBASE_API_KEY=AIzaSyBlOJpzKE3Ez3loiQul0iR5kK7tNzQmemc  
VITE_FIREBASE_AUTH_DOMAIN=snapchef-ai-ce103.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=snapchef-ai-ce103
VITE_FIREBASE_STORAGE_BUCKET=snapchef-ai-ce103.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1875778003
VITE_FIREBASE_APP_ID=1:1875778003:web:415ddb94545ba2308cb726
VITE_FIREBASE_MEASUREMENT_ID=G-VZSZYYQ4M1

```

---

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 4. Migrasi Database

Masuk ke folder backend kemudian jalankan:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Jika sudah pernah dibuat tabelnya, jalankan:

```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
---

### 5. Menjalankan Backend

Masuk ke folder backend.

```bash
npm start
```

Backend akan berjalan pada:

```text
http://localhost:3000
```

---

### 6. Menjalankan Frontend

Masuk ke folder frontend.

```bash
npm run dev
```

Frontend akan berjalan pada:

```text
http://localhost:5173
```

---

### 7. Menjalankan PWA

Untuk menguji fitur Progressive Web App (PWA):

```bash
cd frontend

npm run build
npm run preview
```

Aplikasi akan tersedia di:

```text
http://localhost:4173
```

Gunakan **Google Chrome** agar fitur **Install App**, **Camera API**, dan **Service Worker** dapat berjalan dengan optimal.

---

## ⚠️ Browser Requirement

SnapChef AI dioptimalkan untuk dijalankan menggunakan **Google Chrome**. Beberapa fitur seperti Camera API, Progressive Web App (PWA), dan proses instalasi aplikasi mungkin tidak bekerja dengan baik pada browser lain.

---

## Akun Uji Coba (Test Account)
Gunakan kredensial berikut untuk menguji aplikasi:
- Email: gilbert.situmorang@mikroskil.ac.id
- Password: password123

---

# 📡 API Endpoints

**Base URL (Development)**

```text
http://localhost:3000/api
```

Sebagian besar endpoint memerlukan autentikasi menggunakan JWT.

Header yang digunakan:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 🔐 Authentication

| Method | Endpoint                 | Auth | Description                        |
| ------ | ------------------------ | ---- | ---------------------------------- |
| POST   | `/auth/register`         | ❌    | Registrasi akun baru               |
| POST   | `/auth/login`            | ❌    | Login menggunakan email & password |
| POST   | `/auth/google`           | ❌    | Login menggunakan Google           |
| POST   | `/auth/upgrade-premium`  | ✅    | Upgrade akun menjadi Premium       |
| PUT    | `/auth/diet-preferences` | ✅    | Menyimpan preferensi diet pengguna |

## User Management

| Method | Endpoint          | Auth | Description                 |
| ------ | ----------------- | ---- | --------------------------- |
| GET    | `/auth/users`     | ✅    | Mengambil seluruh data user |
| GET    | `/auth/users/:id` | ✅    | Mengambil detail user       |
| PUT    | `/auth/users/:id` | ✅    | Mengubah data user          |
| DELETE | `/auth/users/:id` | ✅    | Menghapus user              |

---

# 🤖 AI Recipe

| Method | Endpoint              | Auth | Description                                               |
| ------ | --------------------- | ---- | --------------------------------------------------------- |
| POST   | `/recipes/scan`       | ✅    | Scan gambar makanan dan menghasilkan resep menggunakan AI |
| POST   | `/recipes/save`       | ✅    | Menyimpan resep ke database                               |
| GET    | `/recipes`            | ❌    | Mengambil daftar resep                                    |
| GET    | `/recipes/:id`        | ❌    | Mengambil detail resep                                    |
| PUT    | `/recipes/:id/rating` | ✅    | Memberikan rating resep                                   |
| DELETE | `/recipes/:id`        | ✅    | Menghapus resep                                           |

---

# 👨‍🍳 SousChef AI Chat

| Method | Endpoint                     | Auth | Description                                  |
| ------ | ---------------------------- | ---- | -------------------------------------------- |
| GET    | `/recipes/:id/souschef-chat` | ✅    | Mengambil riwayat percakapan AI              |
| POST   | `/recipes/:id/souschef-chat` | ✅    | Mengirim pertanyaan kepada AI mengenai resep |

---

# 📷 Ingredient Scanner

| Method | Endpoint            | Auth | Description                              |
| ------ | ------------------- | ---- | ---------------------------------------- |
| POST   | `/scan/scan`        | ✅    | Scan bahan makanan menggunakan AI Vision |
| GET    | `/scan/history`     | ✅    | Mengambil riwayat scan                   |
| GET    | `/scan/stats`       | ✅    | Statistik penggunaan scan                |
| DELETE | `/scan/history/:id` | ✅    | Menghapus satu riwayat scan              |
| DELETE | `/scan/history`     | ✅    | Menghapus seluruh riwayat scan           |

---

# 🥕 Ingredients

| Method | Endpoint           | Auth | Description          |
| ------ | ------------------ | ---- | -------------------- |
| GET    | `/ingredients`     | ✅    | Daftar bahan makanan |
| GET    | `/ingredients/:id` | ❌    | Detail bahan         |
| POST   | `/ingredients`     | ✅    | Menambahkan bahan    |
| PUT    | `/ingredients/:id` | ✅    | Mengubah bahan       |
| DELETE | `/ingredients/:id` | ✅    | Menghapus bahan      |

---

# 📝 Posts (Community)

| Method | Endpoint     | Auth | Description                     |
| ------ | ------------ | ---- | ------------------------------- |
| GET    | `/posts`     | ❌    | Menampilkan postingan komunitas |
| GET    | `/posts/:id` | ❌    | Detail postingan                |
| POST   | `/posts`     | ✅    | Membuat postingan baru          |
| PUT    | `/posts/:id` | ✅    | Mengubah postingan              |
| DELETE | `/posts/:id` | ✅    | Menghapus postingan             |

---

# 💬 Comments

| Method | Endpoint        | Auth | Description          |
| ------ | --------------- | ---- | -------------------- |
| GET    | `/comments`     | ✅    | Daftar komentar      |
| GET    | `/comments/:id` | ❌    | Detail komentar      |
| POST   | `/comments`     | ✅    | Menambahkan komentar |
| PUT    | `/comments/:id` | ✅    | Mengubah komentar    |
| DELETE | `/comments/:id` | ✅    | Menghapus komentar   |

---

# 💌 Feedback

| Method | Endpoint    | Auth | Description                |
| ------ | ----------- | ---- | -------------------------- |
| GET    | `/feedback` | ❌    | Mengambil seluruh feedback |
| POST   | `/feedback` | ✅    | Mengirim feedback pengguna |

---

# 💬 Chat / Messages

| Method | Endpoint            | Auth | Description                 |
| ------ | ------------------- | ---- | --------------------------- |
| GET    | `/messages/chats`   | ✅    | Mengambil daftar percakapan |
| GET    | `/messages/:chatId` | ✅    | Mengambil isi percakapan    |
| POST   | `/messages/:chatId` | ✅    | Mengirim pesan              |
| POST   | `/messages/upload`  | ✅    | Upload lampiran/chat image  |

---

# 👨‍🍳 Cooking Session

| Method | Endpoint         | Auth | Description          |
| ------ | ---------------- | ---- | -------------------- |
| POST   | `/cooking/start` | ✅    | Memulai sesi memasak |

---

# 📊 Weekly Digest (Premium)

| Method | Endpoint                 | Auth      | Description                                  |
| ------ | ------------------------ | --------- | -------------------------------------------- |
| GET    | `/weekly-digest/:userId` | ✅ Premium | Mengambil laporan aktivitas memasak mingguan |

---

# 💳 Payment

| Method | Endpoint          | Auth | Description                                      |
| ------ | ----------------- | ---- | ------------------------------------------------ |
| POST   | `/payment/create` | ✅    | Membuat transaksi Midtrans untuk upgrade Premium |

---

## 🚀 4. Features

### 🔐 A. Authentication & User Management

1. **Email Authentication** – Registrasi dan login menggunakan email serta password.
2. **Google Sign-In** – Login menggunakan akun Google melalui Firebase Authentication.
3. **Google Account Picker** – Mendukung pemilihan akun Google bagi pengguna yang memiliki lebih dari satu akun.
4. **JWT Authentication** – Sistem autentikasi menggunakan JSON Web Token (JWT).
5. **User Profile Management** – Mengubah informasi profil pengguna.
6. **Dietary Preference Setup** – Menyimpan preferensi diet seperti Halal, Vegetarian, Vegan, Gluten-Free, dan alergi makanan.
7. **Premium Membership Status** – Menampilkan status akun Free atau Premium.

---

### 📸 B. AI Ingredient Scanner

8. **Camera Ingredient Scanner** – Mengambil foto bahan makanan langsung menggunakan kamera perangkat.
9. **Gallery Image Upload** – Mengunggah foto bahan makanan dari galeri perangkat.
10. **AI Ingredient Recognition** – Mengidentifikasi bahan makanan menggunakan Google Gemini Vision.
11. **Real-Time Detection Result** – Menampilkan daftar bahan hasil deteksi AI secara langsung.
12. **Scan History** – Menyimpan riwayat hasil pemindaian bahan makanan.
13. **Daily Scan Limit** – Pengguna Free memiliki batas penggunaan AI Scan harian.
14. **Unlimited Scan** – Pengguna Premium dapat melakukan AI Scan tanpa batas.

---

### 🤖 C. AI Recipe Generator

15. **Dynamic Recipe Generation** – Menghasilkan resep berdasarkan bahan yang berhasil dideteksi.
16. **AI Creative Recipe Title** – AI memberikan nama resep yang menarik secara otomatis.
17. **Recipe Detail View** – Menampilkan bahan, langkah memasak, waktu memasak, dan jumlah porsi.
18. **Nutrition Information** – Menampilkan estimasi kalori, protein, lemak, dan karbohidrat.
19. **Recipe Filtering** – Menyesuaikan hasil resep berdasarkan preferensi diet pengguna.
20. **Ingredient Substitutes** – AI memberikan rekomendasi bahan pengganti apabila suatu bahan tidak tersedia.
21. **Portion Scaler** – Menyesuaikan jumlah bahan secara otomatis berdasarkan jumlah porsi yang dipilih.
22. **Ingredient Availability Indicator** – Memberikan indikator pada bahan yang tidak tersedia serta membedakannya dari bahan yang sudah dimiliki.
23. **Smart Shopping List** – Membuat daftar belanja otomatis berdasarkan bahan yang belum tersedia.
24. **Recipe Rating** – Memberikan penilaian terhadap resep.
25. **Favorite Recipes** – Menyimpan resep favorit.
26. **Personal Cookbook** – Menyimpan resep AI ke koleksi resep pribadi.

---

### 👨‍🍳 D. AI Cooking Assistant

27. **AI Sous Chef Chat** – Chatbot AI yang membantu menjawab pertanyaan seputar proses memasak.
28. **Recipe Customization** – Meminta AI mengubah resep, misalnya menjadi lebih pedas, lebih sehat, atau sesuai kebutuhan diet.
29. **Cooking Guidance** – AI memberikan bantuan selama proses memasak.
30. **Cooking Mode** – Tampilan khusus yang memudahkan pengguna mengikuti langkah memasak satu per satu.

---

### 📊 E. Cooking Activity

31. **Cooking History** – Menyimpan riwayat aktivitas memasak pengguna.
32. **Weekly Cooking Digest** – Menampilkan statistik aktivitas memasak mingguan bagi pengguna Premium.

---

### 👥 F. Community Features

33. **Community Feed** – Menampilkan berbagai postingan hasil masakan dari komunitas.
34. **Create Cooking Post** – Membuat postingan baru beserta foto hasil masakan.
35. **Image Upload** – Mengunggah gambar pada postingan.
36. **Post Privacy Control** – Mengatur visibilitas postingan (Public, Friends, atau Private).
37. **Edit & Delete Post** – Mengubah maupun menghapus postingan milik sendiri.
38. **Comments System** – Memberikan komentar pada postingan pengguna lain.
39. **Community Interaction** – Berinteraksi dengan sesama pengguna melalui postingan komunitas.

---

### 💬 G. Messaging

40. **Private Chat** – Mengirim pesan pribadi antar pengguna.
41. **Cooking Group Chat** – Grup diskusi untuk berbagi pengalaman dan tips memasak.
42. **Image Sharing** – Mengirim gambar melalui percakapan.
43. **Conversation History** – Menyimpan riwayat percakapan secara real-time menggunakan Socket.IO.

---

### 💎 H. Premium Features

44. **Premium Subscription** – Upgrade akun menjadi Premium.
45. **Midtrans Payment Integration** – Simulasi pembayaran Premium menggunakan Midtrans Sandbox.
46. **Premium Badge** – Menampilkan identitas khusus pada akun Premium.
47. **Unlimited AI Features** – Membuka seluruh fitur AI Premium tanpa batasan penggunaan.

---

### 🛒 I. Shopping Integration

48. **Shopee Affiliate Integration** – Mengarahkan pengguna ke halaman pembelian bahan makanan melalui Shopee Affiliate.

---

### 📱 J. Progressive Web App & User Experience

49. **Responsive Design** – Tampilan optimal pada Desktop, Tablet, dan Smartphone.
50. **Progressive Web App (PWA)** – Aplikasi dapat diinstal langsung dari browser.
51. **Dark & Light Mode** – Mendukung pergantian tema tampilan.
52. **Multi-language Support** – Mendukung Bahasa Indonesia dan Bahasa Inggris.
53. **Toast Notifications** – Menampilkan notifikasi interaktif untuk setiap aksi pengguna.
54. **Loading & Progress Indicators** – Menampilkan indikator proses saat AI sedang bekerja.
55. **Offline Asset Caching** – Menggunakan Service Worker untuk mempercepat akses aplikasi.
56. **React Context API State Management** – Mengelola state global pengguna, preferensi diet, dan resep favorit.

---

### ⚙️ K. Additional Features

57. **Help Center & FAQ** – Halaman bantuan dan pertanyaan yang sering diajukan.
58. **Privacy Policy** – Informasi mengenai pengelolaan dan keamanan data pengguna.
59. **Terms & Conditions** – Ketentuan penggunaan aplikasi.
60. **Feedback System** – Formulir bagi pengguna untuk mengirim kritik, saran, maupun laporan kendala.

---

## 📅 5. Development Timeline (March – July 2026)

| Sprint       | Duration        | Main Focus                              | Status |
| :----------- | :-------------- | :-------------------------------------- | :----- |
| **Sprint 1** | 16 Mar – 29 Mar | Project Initialization & Authentication | ✅ Done |
| **Sprint 2** | 30 Mar – 12 Apr | AI Ingredient Scanner                   | ✅ Done |
| **Sprint 3** | 13 Apr – 26 Apr | AI Recipe Generator                     | ✅ Done |
| **Sprint 4** | 27 Apr – 10 May | Personal Cookbook & Search              | ✅ Done |
| **Sprint 5** | 11 May – 24 May | Community Features                      | ✅ Done |
| **Sprint 6** | 25 May – 07 Jun | Premium Features & Messaging            | ✅ Done |
| **Sprint 7** | 08 Jun – 21 Jun | User Experience & Responsive UI         | ✅ Done |
| **Sprint 8** | 22 Jun – 04 Jul | Final Polish & Documentation            | ✅ Done |

---

# 📋 6. Sprint Breakdown

## 🟢 Sprint 1 — Project Initialization & Authentication

**Goal:** Membangun fondasi aplikasi serta sistem autentikasi pengguna.

### Tasks

* Setup React (Vite) dan Tailwind CSS.
* Setup struktur folder Frontend dan Backend.
* Konfigurasi Database MySQL dan Sequelize ORM.
* Implementasi JWT Authentication.
* Implementasi Login & Register.
* Setup Google Sign-In (Firebase Authentication).

**Kanban Cards**

* ✅ User Authentication
* ✅ Frontend Setup
* ✅ Database

**Status:** ✅ Done

---

## 📸 Sprint 2 — AI Ingredient Scanner

**Goal:** Mengembangkan fitur pendeteksi bahan makanan menggunakan Google Gemini Vision.

### Tasks

* Integrasi Google Gemini Vision API.
* Implementasi Camera Scanner.
* Implementasi Upload Image dari galeri.
* Menampilkan hasil deteksi bahan makanan.
* Menyimpan riwayat hasil scan pengguna.

**Kanban Cards**

* ✅ AI Ingredient Scanner (Camera)
* ✅ AI Ingredient Scanner (Upload)
* ✅ Scan History

**Status:** ✅ Done

---

## 🍳 Sprint 3 — AI Recipe Generator

**Goal:** Menghasilkan resep otomatis berdasarkan bahan makanan yang terdeteksi.

### Tasks

* Dynamic Recipe Generation menggunakan Gemini AI.
* Menampilkan informasi nutrisi.
* Menampilkan detail resep.
* Integrasi preferensi diet pengguna.
* AI Sous Chef Chat.

**Kanban Cards**

* ✅ Dynamic Recipe Generation
* ✅ Nutrition Information
* ✅ Recipe Detail View

**Status:** ✅ Done

---

## 📖 Sprint 4 — Personal Cookbook & Search

**Goal:** Mengelola koleksi resep pribadi pengguna.

### Tasks

* Menyimpan resep ke Personal Cookbook.
* Menambahkan resep ke Favorites.
* Implementasi Search Recipe.
* Smart Shopping List.
* Ingredient Availability Indicator.

**Kanban Cards**

* ✅ Personal Cookbook
* ✅ Favorites
* ✅ Search Engine

**Status:** ✅ Done

---

## 👥 Sprint 5 — Community Features

**Goal:** Mengembangkan fitur komunitas untuk berbagi pengalaman memasak.

### Tasks

* Membuat postingan komunitas.
* Upload gambar hasil masakan.
* Menampilkan Community Feed.
* Implementasi Like System.
* Implementasi Comment System.
* Edit & Delete Post.
* Post Privacy.

**Kanban Cards**

* ✅ Create Post
* ✅ Like System
* ✅ Community Feed
* ✅ Comment System

**Status:** ✅ Done

---

## 💎 Sprint 6 — Premium Features & Messaging

**Goal:** Menambahkan fitur Premium dan komunikasi antar pengguna.

### Tasks

* Implementasi Premium Subscription.
* Integrasi Midtrans Sandbox.
* Daily Scan Limit.
* Unlimited Scan untuk Premium.
* Private Messaging menggunakan Socket.IO.

**Kanban Cards**

* ✅ Premium Subscription
* ✅ Daily Scan Limit
* ✅ Messaging

**Status:** ✅ Done

---

## 🎨 Sprint 7 — User Experience & Responsive UI

**Goal:** Meningkatkan pengalaman pengguna pada seluruh perangkat.

### Tasks

* Implementasi Dark & Light Mode.
* Bottom Navigation.
* Responsive Design.
* Toast Notifications.
* Progressive Web App (PWA).
* Multi-language Support.

**Kanban Cards**

* ✅ Dark Mode
* ✅ Bottom Navigation
* ✅ Responsive Design
* ✅ Toast Notification

**Status:** ✅ Done

---

## ⚙️ Sprint 8 — Final Polish & Documentation

**Goal:** Menyelesaikan pengembangan aplikasi serta mempersiapkan dokumentasi dan deployment.

### Tasks

* Bug Fixing.
* Performance Optimization.
* Security Testing.
* Final Deployment.
* Penyusunan README.
* Dokumentasi API.
* Persiapan presentasi dan demo aplikasi.

**Kanban Cards**

* ✅ Bug Fixing
* ✅ Performance Optimization
* ✅ Documentation

**Status:** ✅ Done
 
---

## DEMO TAMPILAN : https://safari-status-23803732.figma.site
## GITHUB : https://github.com/therania02/SnapChef-AI-PWA
## DEPLOYMENT RAILWAY : https://frontend-production-cd2b.up.railway.app/
