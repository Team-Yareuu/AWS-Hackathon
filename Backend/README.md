# Culinary AI Backend

Backend untuk aplikasi AI kuliner yang memberikan rekomendasi resep berdasarkan bahan-bahan yang dimiliki pengguna. Aplikasi ini memanfaatkan Knowledge Graph sebagai sumber kebenaran (ground truth) dan AWS Bedrock untuk kemampuan Generative AI.

## Overview Proyek

Aplikasi ini memungkinkan pengguna untuk berinteraksi melalui antarmuka chat, menyebutkan bahan makanan yang mereka miliki. AI kemudian akan:
1.  Menganalisis bahan-bahan tersebut.
2.  Mencari resep yang cocok dari Knowledge Graph.
3.  Memberikan rekomendasi resep yang paling relevan.
4.  Menghasilkan gambar dari resep yang dipilih menggunakan model generasi gambar.

## Tech Stack

-   **Language**: Python 3.10+
-   **Framework**: FastAPI
-   **AI Platform**: Amazon Bedrock
-   **Agent Framework**: `strands-agents`
-   **Database**: Neo4j (atau Amazon Neptune) untuk Knowledge Graph
-   **AI Models**:
    -   **LLM**: Claude 3.5 Sonnet
    -   **Image Generation**: Stability AI SDXL / Amazon Titan Image Generator

## Arsitektur

Proyek ini mengikuti arsitektur modular yang memisahkan setiap komponen utama:

```
backend/
├── agents/         # Logika untuk setiap agent (analisis, retrieval, dll.)
├── knowledge_graph/  # Manajemen koneksi dan query ke KG
├── bedrock/        # Klien dan handler untuk interaksi dengan AWS Bedrock
├── api/            # Endpoints API, model Pydantic, dan middleware
├── utils/          # Utilitas dan template prompt
├── config/         # Konfigurasi aplikasi
├── main.py         # Titik masuk aplikasi FastAPI
└── requirements.txt
```

## Setup & Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### 1. Prasyarat

-   Python 3.10 atau lebih tinggi
-   Akun AWS dengan akses ke Amazon Bedrock
-   Database Neo4j yang sedang berjalan (bisa menggunakan Docker)

### 2. Kloning Repositori

```bash
git clone <URL_REPOSITORI_ANDA>
cd hackathon-AWS-backend
```

### 3. Setup Lingkungan Virtual & Dependensi

```bash
# Buat dan aktifkan lingkungan virtual (contoh menggunakan venv)
python -m venv venv
source venv/bin/activate  # Di Windows: venv\Scripts\activate

# Install dependensi
pip install -r backend/requirements.txt
```

### 4. Konfigurasi Variabel Lingkungan

Buat file `.env` di root direktori proyek dan isi dengan konfigurasi yang diperlukan. Salin dari contoh di bawah:

```env
# AWS Bedrock
AWS_REGION="us-east-1"

# Neo4j Knowledge Graph
NEO4J_URI="bolt://localhost:7687"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="your_neo4j_password"
```

### 5. Menjalankan Aplikasi

Gunakan Uvicorn untuk menjalankan server FastAPI:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Aplikasi akan tersedia di `http://127.0.0.1:8000`. Anda dapat mengakses dokumentasi API interaktif di `http://127.0.0.1:8000/docs`.
This is a test commit.