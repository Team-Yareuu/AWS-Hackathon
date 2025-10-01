---

# **AI Agent Development Plan & Rules: Backend "AI Resepku"**

Dokumen ini adalah rencana strategis dan serangkaian aturan untuk diikuti oleh AI Agent dalam membangun backend untuk aplikasi "AI Resepku".

## **1. Tujuan Utama Proyek (Project Goal)**

Membangun backend yang kuat, skalabel, dan cerdas menggunakan FastAPI, Neo4j, dan AWS Bedrock untuk mendukung semua fitur yang ada di aplikasi frontend "AI Resepku". Fokus utama adalah pada pemodelan data kuliner yang kaya menggunakan *graph database* dan menyediakan layanan AI untuk rekomendasi resep yang dipersonalisasi.

## **2. Prinsip-Prinsip Inti (Core Principles)**

1.  **Modularitas**: Setiap komponen (API, CRUD, services) harus independen dan mudah diuji.
2.  **Skalabilitas**: Arsitektur harus dirancang untuk menangani pertumbuhan pengguna dan data di masa depan.
3.  **Kebenaran Data**: Neo4j adalah *single source of truth*. Semua data harus dimodelkan secara akurat dalam bentuk *graph*.
4.  **Keamanan**: Implementasikan praktik keamanan terbaik, terutama untuk data pengguna dan autentikasi.
5.  **Performa**: API harus responsif. Gunakan *asynchronous programming* dari FastAPI secara maksimal.

## **3. Model Data Graph (Neo4j)**

Ini adalah fondasi dari seluruh backend. Gunakan model berikut untuk merepresentasikan entitas dan hubungan kuliner:

### **Nodes (Entitas):**

* `(:Recipe)`: Resep masakan.
    * *Properties*: `id`, `name`, `description`, `image`, `difficulty`, `cookingTime`, `servings`, `estimatedCost`, `region`.
* `(:Ingredient)`: Bahan masakan.
    * *Properties*: `name`, `category` (e.g., 'protein', 'sayuran').
* `(:User)`: Pengguna aplikasi.
    * *Properties*: `id`, `name`, `email`, `hashed_password`, `level`.
* `(:Cuisine)`: Jenis masakan atau asal daerah.
    * *Properties*: `name` (e.g., 'Jawa', 'Sumatera').
* `(:DietaryPreference)`: Preferensi diet.
    * *Properties*: `name` (e.g., 'Vegetarian', 'Halal').
* `(:CookingTechnique)`: Teknik memasak.
    * *Properties*: `name` (e.g., 'Menumis', 'Bacem').

### **Relationships (Hubungan):**

* `(:Recipe)-[:HAS_INGREDIENT {quantity: "1 kg"}]->(:Ingredient)`
* `(:Recipe)-[:BELONGS_TO_CUISINE]->(:Cuisine)`
* `(:Recipe)-[:SUITABLE_FOR]->(:DietaryPreference)`
* `(:Recipe)-[:USES_TECHNIQUE]->(:CookingTechnique)`
* `(:User)-[:SAVED]->(:Recipe)`
* `(:User)-[:COOKED]->(:Recipe)`
* `(:User)-[:HAS_PREFERENCE]->(:DietaryPreference)`
* `(:Ingredient)-[:CAN_BE_REPLACED_BY]->(:Ingredient)`

## **4. Rencana Pengembangan Bertahap (Phased Development Plan)**

### **Fase 1: Fondasi & API Inti (Core Foundation)**

**Tujuan**: Membangun dasar aplikasi dengan fungsionalitas CRUD untuk resep dan autentikasi pengguna.

* **Tugas 1.1: Setup Proyek & Database**
    * Gunakan struktur folder yang telah disediakan.
    * Implementasikan koneksi ke Neo4j di `app/db/session.py`. Pastikan koneksi dapat menangani *retries* dan *error*.
    * Buat *script* migrasi data awal untuk memasukkan data resep, bahan, dan masakan dari frontend ke dalam Neo4j.

* **Tugas 1.2: Autentikasi Pengguna**
    * Buat `schemas/user.py` untuk `UserCreate`, `User`, dan `Token`.
    * Implementasikan fungsi *hashing* dan verifikasi *password* di `app/core/security.py`.
    * Buat *endpoint* di `api/v1/endpoints/users.py` untuk:
        * `POST /users/register`: Membuat pengguna baru.
        * `POST /token`: Login dan mendapatkan JWT token.

* **Tugas 1.3: CRUD Resep**
    * Lengkapi `crud/crud_recipe.py` dengan fungsi Cypher untuk:
        * `create()`: Membuat node `:Recipe` beserta hubungannya ke `:Ingredient` dan `:Cuisine`.
        * `get()`: Mengambil satu resep beserta semua bahan dan langkah-langkahnya.
        * `get_multi()`: Mengambil daftar resep dengan paginasi.
        * `update()` & `delete()`: (Opsional untuk awal).
    * Pastikan *endpoint* di `api/v1/endpoints/recipes.py` berfungsi dengan baik.

### **Fase 2: Integrasi AI & Fitur Pencarian Cerdas**

**Tujuan**: Mengimplementasikan fitur pencarian cerdas dan asisten AI menggunakan AWS Bedrock.

* **Tugas 2.1: Layanan AWS Bedrock**
    * Buat file `app/services/bedrock_agent.py`.
    * Implementasikan fungsi untuk berinteraksi dengan model LLM (Claude 3.5 Sonnet) untuk memproses kueri bahasa natural.
    * Buat fungsi untuk interaksi dengan model *Image Generation* (Stability AI SDXL).

* **Tugas 2.2: Endpoint Pencarian Cerdas**
    * Buat *endpoint* `POST /ai/search` di `api/v1/endpoints/ai.py`.
    * **Alur Kerja**:
        1.  Terima kueri bahasa natural (e.g., "resep ayam pedas budget 50rb").
        2.  Kirim kueri ke `bedrock_agent.py` untuk diekstrak menjadi entitas terstruktur (bahan: 'ayam', rasa: 'pedas', budget: '<50000').
        3.  Gunakan entitas hasil ekstraksi untuk membangun kueri Cypher yang kompleks ke Neo4j.
        4.  Kembalikan daftar resep yang paling relevan.

* **Tugas 2.3: Asisten AI (Chat)**
    * Buat *endpoint* `POST /ai/assistant` untuk fitur chat di halaman detail resep.
    * **Alur Kerja**:
        1.  Terima pertanyaan pengguna dan konteks resep saat ini.
        2.  Kirim ke `bedrock_agent.py` dengan *prompt* yang sudah dirancang untuk menjawab seputar substitusi bahan, tips memasak, dll.
        3.  Backend tidak perlu menyimpan status percakapan (stateless), biarkan frontend yang mengelola histori chat.

### **Fase 3: Fitur Personal & Interaksi Pengguna**

**Tujuan**: Membangun fitur-fitur yang meningkatkan personalisasi dan interaksi pengguna.

* **Tugas 3.1: Dapur Saya (Personal Kitchen)**
    * Buat *endpoint* untuk:
        * `POST /users/me/saved-recipes`: Menyimpan resep.
        * `GET /users/me/saved-recipes`: Mengambil daftar resep yang disimpan.
        * `POST /users/me/meal-plan`: Menyimpan rencana makan mingguan.
        * `GET /users/me/shopping-history`: Mengambil riwayat belanja.

* **Tugas 3.2: Sistem Pencapaian (Achievements)**
    * Desain *graph model* untuk melacak aktivitas pengguna (`(:User)-[:COOKED]->(:Recipe)`).
    * Buat *service* yang secara periodik atau *on-demand* memeriksa apakah pengguna memenuhi kriteria pencapaian (e.g., "memasak 5 resep dari Jawa").

* **Tugas 3.3: Pelacak Harga & Budget**
    * Buat *endpoint* `GET /ingredients/price-history` untuk melacak histori harga bahan.
    * Buat *endpoint* untuk pengguna mengatur *budget alert*.

### **Fase 4: Pengoptimalan, Pengujian, dan Persiapan Produksi**

**Tujuan**: Memastikan backend stabil, aman, dan siap untuk di-*deploy* ke lingkungan produksi.

*   **Tugas 4.1: Pengujian Menyeluruh (Comprehensive Testing)**
    *   Buat *test case* untuk setiap *endpoint* API, mencakup skenario sukses dan gagal.
    *   Implementasikan *integration test* untuk memastikan alur kerja utama (registrasi -> login -> cari resep -> simpan resep) berfungsi dengan baik.
    *   Lakukan pengujian beban (load testing) sederhana untuk mengidentifikasi *bottleneck* performa.

*   **Tugas 4.2: Logging dan Monitoring**
    *   Konfigurasikan *structured logging* di seluruh aplikasi untuk memudahkan analisis dan *debugging*.
    *   Integrasikan dengan layanan monitoring (misalnya, AWS CloudWatch) untuk melacak kesehatan aplikasi, penggunaan sumber daya, dan *error rate*.

*   **Tugas 4.3: Keamanan dan Konfigurasi Produksi**
    *   Implementasikan CORS (Cross-Origin Resource Sharing) dengan benar di `main.py` untuk hanya mengizinkan permintaan dari domain frontend.
    *   Gunakan *environment variables* untuk semua konfigurasi sensitif (kunci API, kredensial database). Jangan pernah melakukan *hardcode*.
    *   Siapkan Dockerfile untuk mengemas aplikasi menjadi *container* yang siap di-*deploy*.

### **Fase 5: Pasca-Peluncuran dan Pengembangan Berkelanjutan**

**Tujuan**: Memelihara aplikasi, memonitor performa, dan merencanakan iterasi fitur berikutnya berdasarkan umpan balik pengguna.

*   **Tugas 5.1: Deployment dan CI/CD**
    *   Buat alur kerja CI/CD (misalnya, menggunakan GitHub Actions) untuk otomatisasi proses *testing* dan *deployment*.
    *   *Deploy* aplikasi ke platform pilihan (misalnya, AWS ECS, AWS App Runner, atau Heroku).

*   **Tugas 5.2: Pemeliharaan dan Iterasi**
    *   Monitor performa aplikasi dan *database* secara berkala.
    *   Kumpulkan umpan balik dari pengguna untuk merencanakan fitur baru atau perbaikan.
    *   Lakukan pembaruan *library* secara rutin untuk menjaga keamanan dan mendapatkan fitur terbaru.

## **5. Aturan untuk AI Agent (Agent Rules & Directives)**

Ini adalah aturan ketat yang harus diikuti selama pengembangan:

1.  **Prioritaskan Keamanan**:
    *   **Jangan pernah** menyimpan *password* dalam bentuk *plain text*. Selalu gunakan *hashing* (`passlib`).
    *   Validasi dan sanitasi semua *input* dari pengguna untuk mencegah *injection attacks* (termasuk Cypher injection).
    *   Gunakan JWT untuk mengamankan *endpoint* yang memerlukan autentikasi.

2.  **Kualitas Kode**:
    *   Semua kode harus menggunakan *type hints* dari modul `typing` Python.
    *   Gunakan Pydantic `BaseModel` untuk semua skema data API. Jangan pernah menggunakan `dict` mentah.
    *   Pisahkan logika dengan jelas:
        *   `endpoints`: Hanya menangani *request/response* HTTP.
        *   `crud`: Hanya berisi kueri Cypher dan logika interaksi *database*.
        *   `services`: Berisi logika bisnis kompleks dan interaksi dengan layanan eksternal (seperti AWS Bedrock).

3.  **Manajemen Error**:
    *   Gunakan `HTTPException` dari FastAPI untuk mengembalikan kode status HTTP yang sesuai.
    *   Tambahkan *logging* untuk *error* yang terjadi di sisi server, terutama saat koneksi ke *database* atau layanan AI gagal.

4.  **Ketergantungan (Dependencies)**:
    *   Semua *library* yang dibutuhkan **harus** didefinisikan di `requirements.txt`.
    *   Jangan menambahkan *library* yang tidak esensial.

5.  **Dokumentasi**:
    *   Gunakan *docstring* untuk menjelaskan fungsi-fungsi yang kompleks.
    *   Manfaatkan fitur FastAPI untuk menghasilkan dokumentasi OpenAPI (`/docs`) secara otomatis dengan menambahkan `title`, `description`, dan `tags` pada *router* dan *endpoint*.

6.  **Pengujian**:
    *   Buat kerangka pengujian menggunakan `pytest`.
    *   Setiap *endpoint* baru harus memiliki setidaknya satu *test case* dasar untuk memastikan fungsionalitasnya.

---