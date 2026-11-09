# LAPORAN TUGAS PROYEK PENGEMBANGAN APLIKASI WEB BERBASIS ARTIFICIAL INTELLIGENCE
## EduSmart AI: Platform Pembelajaran Cerdas & Tutor Interaktif Adaptif untuk Pelajar SMP, SMA/SMK, dan Perguruan Tinggi

---

### IDENTITAS KELOMPOK
- **Mata Kuliah / Tugas**: Pengembangan Aplikasi Berbasis AI (Artificial Intelligence)
- **Nama Aplikasi / Website**: **EduSmart AI**
- **Nama Tim / Kelompok**: Tim EduSmart Cerdas
- **Anggota Kelompok**:
  1. **Gina Azzahra** (Ketua Tim / Project Lead & Fullstack AI Integrator)
  2. **Anggota 2** (Frontend Developer & UI/UX Specialist)
  3. **Anggota 3** (Backend & Prompt Engineer)
  4. **Anggota 4** (Quality Assurance & Academic Content Specialist)
- **Link Akses Online (Production/Shared)**: `https://ais-pre-vdb5ab76a2eb2vv3uobsbr-572611332815.asia-east1.run.app`
- **Link Lingkungan Pengembangan (Development)**: `https://ais-dev-vdb5ab76a2eb2vv3uobsbr-572611332815.asia-east1.run.app`

---

## 1. JUDUL DAN DESKRIPSI PROYEK

### Judul Proyek
**EduSmart AI: Solusi Ekosistem Pendidikan Digital Adaptif Berbasis Model Generatif Cerdas untuk Peningkatan Kualitas Belajar Mandiri Pelajar Indonesia**

### Deskripsi Proyek
**EduSmart AI** adalah platform pembelajaran berbasis web cerdas (*AI-Powered Educational Web App*) yang dirancang khusus untuk memenuhi kebutuhan belajar siswa tingkat Sekolah Menengah Pertama (SMP), Sekolah Menengah Atas / Kejuruan (SMA/SMK), hingga Mahasiswa Perguruan Tinggi.

Aplikasi ini mengintegrasikan model kecerdasan buatan mutakhir (**Google Gemini 3.8 Flash**) melalui komunikasi aman di sisi *backend* (*server-side proxy*) dengan kapabilitas **Server-Sent Events (SSE) Streaming**. Melalui teknologi ini, EduSmart AI menyediakan fasilitas:
1. **Tutor AI Interaktif** dengan gaya respons adaptif bertingkat yang menyertakan referensi literatur valid.
2. **Rangkuman Materi Otomatis** yang mengekstraksi inti konsep pembelajaran secara kompresif dan faktual tanpa halusinasi.
3. **Kuis Interaktif Adaptif** berbasis *structured JSON* dengan validasi otomatis, perhitungan skor real-time, dan pembahasan mendalam setiap butir soal.
4. **Dashboard & Riwayat Belajar Terintegrasi** untuk memantau perkembangan kognitif siswa secara berkelanjutan.

---

## 2. LATAR BELAKANG MASALAH DAN TUJUAN

### 2.1. Latar Belakang Masalah
Dalam proses pembelajaran modern di Indonesia, pelajar menghadapi beberapa hambatan krusial:
1. **Keterbatasan Akses Bimbingan Personal (1-on-1 Tutoring)**: Rasio pengajar dan murid di sekolah formal sering kali membatasi guru untuk memberikan bimbingan individual mendalam bagi setiap siswa yang memiliki kecepatan tangkap belajar berbeda.
2. **Beban Materi Belajar yang Padat (*Information Overload*)**: Kurikulum pelajaran sekolah dan perkuliahan menuntut siswa membaca buku ajar tebal dan modul materi panjang, sehingga siswa sering kali kesulitan menyaring esensi penting sebelum ujian.
3. **Kurangnya Sarana Evaluasi Mandiri yang Kontekstual**: Latihan soal buku konvensional memiliki kunci jawaban statis tanpa penjabaran analitis mengapa opsi jawaban tersebut benar dan mengapa opsi lain salah.
4. **Isu Kecepatan dan Latensi pada Aplikasi AI**: Banyak platform AI konvensional yang memproses jawaban dalam format *batching* panjang, menimbulkan kesan bahwa aplikasi "membeku" (*freezing*) sebelum jawaban tampil utuh.

### 2.2. Tujuan Proyek
1. Mengembangkan website pendidikan responsif dan minimalis dengan navigasi modern (palet warna Biru, Putih, dan Navy).
2. Mengintegrasikan teknologi Generative AI berbasis **Gemini 3.8 Flash** yang aman (tanpa membocorkan API Key ke browser klien).
3. Mengimplementasikan teknik **Streaming Respons Real-Time (Server-Sent Events)** pada AI Tutor dan Rangkuman Materi untuk menghilangkan persepsi kelambatan (*instant latency reduction*).
4. Menyediakan generator kuis pilihan ganda terstruktur (*JSON-enforced*) dengan tingkat kesulitan dan jenjang pendidikan yang dapat disesuaikan.
5. Membangun sistem pelacakan riwayat aktivitas dan profil siswa untuk mendukung kebiasaan belajar harian (*streak learning*).

---

## 3. TARGET PENGGUNA

EduSmart AI secara khusus mengimplementasikan sistem kepribadian AI (*persona adaptation*) untuk tiga segmen pengguna:

| Target Pengguna | Karakteristik Kognitif | Penyesuaian Gaya Bahasa & Output AI |
|---|---|---|
| **Siswa SMP (Kelas 7–9)** | Membutuhkan analogi konkret, bahasa sederhana, menghindari rumus rumit tanpa pengantar dasar. | Menggunakan bahasa ramah, penyederhanaan terminologi, contoh kejadian sehari-hari, serta motivasi positif. |
| **Siswa SMA / SMK (Kelas 10–12)** | Membutuhkan pemahaman logis, rumus eksak, latihan soal UTBK SNBT, dan studi kasus vokasional. | Menguraikan langkah matematis sistematis, konsep sebab-akibat, penekanan rumus, dan referensi buku ajar SMA. |
| **Mahasiswa (Perguruan Tinggi)** | Berorientasi pada pemikiran kritis, metodologi riset, jurnal ilmiah, dan konsep teoretis lanjut. | Bahasa akademis formal, sintesis analitis komparatif, dan pencantuman landasan teoretis atau standar industri. |

---

## 4. DAFTAR FITUR UTAMA

### 4.1. Beranda (*Landing Page*)
- Pengenalan nilai utama EduSmart AI, statistik fitur, navigasi cepat, dan pemilih tingkat pendidikan instan.
- Informasi keamanan sistem dan jaminan keterhubungan AI aktif.

### 4.2. Dashboard Belajar
- Ringkasan aktivitas harian: total kuis diselesaikan, total rangkuman dibuat, jumlah konsultasi AI Tutor, dan rata-rata skor kuis.
- Indikator *streak learning* untuk memotivasi rutinitas belajar.
- Akses cepat menuju riwayat evaluasi terakhir.

### 4.3. AI Tutor Interaktif (dengan Live SSE Streaming)
- **Komunikasi Percakapan Fleksibel**: Pengguna dapat menanyakan materi apapun dalam berbagai mata pelajaran (Matematika, IPA, Fisika, Kimia, Biologi, Bahasa, IT, Sejarah, Ekonomi).
- **Live Streaming Feedback**: Karakter teks muncul secara instan per pecahan token dengan animasi kursor kedip `▋`.
- **Kontrol Penghentian (*Abort Streaming*)**: Tombol "Hentikan" merah yang memutus aliran stream seketika via `AbortController`.
- **Preset Pertanyaan Kurikulum**: Disediakan tombol jalan pintas soal sesuai jenjang pengguna.
- **Referensi Terpercaya**: Setiap jawaban wajib menyertakan rujukan pustaka resmi untuk validasi materi.

### 4.4. AI Rangkuman Materi Otomatis (dengan Live SSE Streaming)
- Pengguna menempelkan teks materi panjang (artikel, bab buku, atau catatan kuliah).
- AI menghasilkan rangkuman terstruktur:
  - *Judul Rangkuman*
  - *Inti Pembahasan*
  - *Poin-Poin Penting*
  - *Glosarium Konsep Kunci (Term & Definisi)*
  - *Kesimpulan Akhir / Takeaway*
- Penghitungan rasio kompresi kata otomatis (% penghematan waktu baca).
- Tombol satu klik "Salin Rangkuman" dan "Simpan ke Riwayat".

### 4.5. Kuis Pilihan Ganda AI Interaktif
- Input topik bebas, pemilihan tingkat kesulitan (*Mudah*, *Sedang*, *Sulit*), dan jumlah soal (3, 5, 10).
- Skema JSON ketat (*Strict Type Schema*) menjamin 4 opsi (A, B, C, D) dan tepat satu jawaban benar.
- Kunci jawaban **dirahasiakan** hingga kuis diselesaikan siswa.
- Indikator tahapan pembuatan kuis (*progressive stage loading*) saat model merumuskan soal.
- Timer pengerjaan kuis real-time dan navigator butir soal.

### 4.6. Hasil Evaluasi & Pembahasan Komprehensif
- Kalkulasi skor otomatis (skala 0–100) disertai predikat (Sangat Memuaskan, Baik, Cukup, Perlu Remedial).
- Rincian pembahasan setiap butir soal yang menjelaskan mengapa opsi yang benar tepat dan mengapa opsi distraktor keliru.
- Fitur "Konsultasikan ke Tutor AI" yang mengirimkan nomor soal yang keliru langsung ke ruang percakapan AI Tutor.

### 4.7. Riwayat Belajar & Manajemen Data (*History*)
- Penyimpanan persisten ke berkas basis data lokal (`data/db.json`).
- Pengelompokan riwayat per modul (Kuis, Rangkuman, Tutor).
- Filter pencarian, hapus item, dan hapus seluruh riwayat.

### 4.8. Manajemen Profil Pelajar
- Pengaturan nama, jenjang pendidikan, nama institusi/sekolah, jurusan/kelas, dan target harian.

---

## 5. TEKNOLOGI DAN TOOLS AI YANG DIGUNAKAN

### 5.1. Stack Perangkat Lunak
- **Frontend Framework**: React 19 (Hooks, Functional Components, Context API).
- **Build Tool & Bundler**: Vite 8.3 dengan konfigurasi *modern ESNext bundler*.
- **Bahasa Pemrograman**: TypeScript 7.0 (Strict mode, No-Any discipline).
- **Styling UI/UX**: Tailwind CSS 4.x (Desain bersih warna Biru `#2563eb`, Navy `#0f172a`, Putih `#ffffff`).
- **Ikonografi & Animasi**: Lucide React & Canvas-Confetti untuk selebrasi pencapaian kuis.
- **Backend Server**: Node.js dengan Express 4.x yang melayani *proxy API* internal pada *port 3000*.
- **Unit Testing**: Vitest 5.x untuk pengujian utilitas bisnis, perhitungan kuis, dan parser rangkuman.

### 5.2. Tools & Model Kecerdasan Buatan (AI)
- **Model Utama**: **Google Gemini 3.8 Flash** (`@google/genai` TypeScript SDK versi resmi 2.32.0).
- **Model Cadangan (Fallback)**: `gemini-flash-latest`.
- **Parameter Latensi**: Menggunakan `ThinkingLevel.LOW` untuk mengurangi durasi komputasi *reasoning* internal sehingga respons teks terkirim dalam fraksi detik.
- **Protokol Komunikasi**:
  - **Server-Sent Events (SSE)** untuk streaming teks asinkronus (`text/event-stream`).
  - **JSON Schema Enforcement** menggunakan parameter `responseMimeType: "application/json"` dan `responseSchema` bertipe skema objek kaku (*Type.OBJECT*, *Type.ARRAY*, dll).

---

## 6. ARSITEKTUR DAN PROSES PENGEMBANGAN

### 6.1. Diagram Alur Arsitektur Sistem
```
[ Browser / Klien Pelajar ]
       │
       │ (1) HTTP POST / SSE Stream Request (JSON)
       ▼
[ Express Server Proxy (server.ts) :3000 ]
  ├── Middleware CORS & Validasi Input
  ├── Penyimpanan Riwayat (data/db.json)
  ├── Perlindungan Kunci Rahasia: process.env.GEMINI_API_KEY
       │
       │ (2) Google GenAI SDK (Internal Auth)
       ▼
[ Google Gemini 3.8 Flash Engine ]
       │
       │ (3) Stream Token Chunks (SSE) / JSON Object
       ▼
[ Express Proxy ] ─── SSE (data: {"text":"..."}) ───► [ React UI (Live Markdown Render) ]
```

### 6.2. Metodologi Pengembangan (Agile SDLC)
1. **Analisis Kebutuhan**: Merumuskan modul wajib (Tutor, Rangkuman, Kuis, Evaluasi, Riwayat, Profil).
2. **Desain Antarmuka**: Menerapkan konstitusi UI modern bernuansa *blue-white-navy* responsif untuk *mobile* hingga *desktop*.
3. **Pembangunan Backend Proxy**: Membuat rute REST dan SSE di `server.ts` agar kunci API tidak pernah terekspos ke klien.
4. **Implementasi Streaming SSE**: Mengatasi masalah latensi lambat dengan mengubah *batch fetch* menjadi aliran data per karakter.
5. **Mitigasi Masalah & Fallback**: Mengatasi *quota limit* dan error status HTTP 503 dengan memasang *model fallback pipeline*.
6. **Unit Testing & Verifikasi**: Menulis test suite Vitest untuk logika skor kuis dan parser dokumen.

---

## 7. HASIL PENGUJIAN FITUR

### 7.1. Pengujian Unit Otomatis (Automated Unit Testing)
Pengujian dijalankan dengan kerangka kerja **Vitest**:
```
✓ src/utils/summaryUtils.test.ts (5 tests)
  ✓ calculateCompressionRatio calculates percentage saved correctly
  ✓ validateSummaryInput identifies valid and empty inputs
  ✓ parseMarkdownToSummary parses AI text into structured summary object
  ✓ truncateText trims text with ellipsis
  ✓ isSummaryResult checks valid object structure

✓ src/utils/quizUtils.test.ts (4 tests)
  ✓ calculateQuizScore computes correct percentages
  ✓ getScoreEvaluation returns appropriate badge and remarks
  ✓ formatSecondsToTime formats seconds into mm:ss
  ✓ validateQuizQuestion checks valid schema

Test Files: 2 passed (2)
Tests:      9 passed (9)
Duration:   508ms
```

### 7.2. Pengujian Fungsional Sistem (Black-box Testing)

| Modul | Skenario Uji | Masukan (*Input*) | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **AI Tutor** | Pertanyaan materi fisika jenjang SMA | "Jelaskan prinsip kerja Siklus Carnot" | Model mengirimkan token secara streaming dalam <1 detik, mencakup rumus dan referensi pustaka resmi. | **BERHASIL** |
| **AI Tutor** | Validasi masukan kosong | Teks kosong / spasi | Tombol kirim dinonaktifkan, muncul pesan validasi peringatan. | **BERHASIL** |
| **AI Tutor** | Fitur Stop Streaming | Menekan tombol "Hentikan" saat AI mengetik | Stream langsung berhenti via `AbortController` tanpa eror pada antarmuka. | **BERHASIL** |
| **Rangkuman** | Meringkas artikel biologi | 3 paragraf teks fotosintesis | AI menghasilkan judul, inti, 4 poin utama, glosarium konsep, dan kesimpulan tanpa mengarang hal di luar teks. | **BERHASIL** |
| **Kuis AI** | Pembuatan 5 soal kimia tingkat sedang | Topik: "Stoikiometri & Larutan", 5 Soal | Menghasilkan persis 5 soal pilihan ganda A, B, C, D dengan kunci tersembunyi hingga selesai. | **BERHASIL** |
| **Evaluasi** | Pengumpulan jawaban kuis | Menjawab 4 benar dari 5 soal | Skor tercatat 80/100, predikat "Sangat Baik", pembahasan tampil lengkap untuk setiap nomor. | **BERHASIL** |
| **Riwayat** | Sinkronisasi data belajar | Selesai mengerjakan kuis | Kuis otomatis tercatat di halaman Riwayat Belajar dan Dashboard secara real-time. | **BERHASIL** |

---

## 8. DOKUMENTASI PENGGUNAAN ARTIFICIAL INTELLIGENCE (AI)

### 8.1. Contoh Prompt & Konfigurasi Sistem

#### A. Prompt System Instruction: AI Tutor Interaktif
```ts
const systemInstruction = `Anda adalah Tutor Cerdas EduSmart AI (${subject}).
Target: ${educationPersona}
${speedDirective}

Format Markdown yang rapi:
- **Ringkasan Inti**: Jawaban langsung.
- **Konsep & Pembahasan**: Langkah terstruktur atau poin penting.
- **Referensi Terpercaya**: 1-2 sumber rujukan resmi (Kemendikbud/buku teks/jurnal).`;
```
- **Contoh Input Siswa**: *"Mengapa langit pada siang hari berwarna biru sedangkan saat senja berwarna merah jingga?"* (Jenjang SMP, Mapel IPA).
- **Hasil yang Diperoleh**: AI menjelaskan fenomena Hamburan Rayleigh (*Rayleigh Scattering*) dengan analogi panjang gelombang cahaya tampak, dilengkapi rujukan Buku IPA Terpadu Kemendikbudristek Kelas 8.
- **Penanganan Hasil**: Respons dialirkan menggunakan `generateContentStream` dengan `ThinkingLevel.LOW` agar siswa tidak menunggu lebih dari 1 detik.

#### B. Prompt System Instruction: Kuis AI Terstruktur (Strict JSON Schema)
```ts
const systemInstruction = `Anda adalah Pembuat Soal Kuis Ujian Profesional EduSmart AI.
Tugas Anda: Menghasilkan persis ${count} soal pilihan ganda tentang "${topic}" 
untuk tingkat pendidikan: ${educationLevel} dengan tingkat kesulitan: ${difficulty}.

ATURAN PEMBUATAN SOAL:
1. Buat tepat 4 pilihan jawaban untuk setiap soal (A, B, C, D).
2. Tentukan satu kunci jawaban mutlak benar (huruf tunggal A/B/C/D).
3. Berikan pembahasan (explanation) mendalam dan edukatif.
4. Output HARUS JSON terstruktur yang valid sesuai skema.`;
```
- **Contoh Input**: Topik *"Hukum Gravitasi Newton"*, SMA/SMK, Tingkat Sedang, 5 Soal.
- **Hasil yang Diperoleh**: Objek JSON valid yang langsung dipetakan ke komponen kartu kuis interaktif tanpa risiko kesalahan sintaks.

### 8.2. Penjelasan Bagaimana Hasil AI Digunakan dan Diperbaiki
1. **Pencegahan Halusinasi pada Rangkuman**:
   Instruksi sistem menegaskan: *"HANYA gunakan informasi yang ada di dalam teks materi yang diberikan. Jangan mengarang informasi di luar teks sumber."*
2. **Kerahasiaan Kunci Jawaban**:
   Kunci jawaban disimpan di memori klien selama kuis berlangsung, tetapi tidak dirender pada DOM kuis aktif sampai siswa menekan tombol "Selesai & Kumpulkan Kuis".
3. **Penanganan Error Terbimbing (*Graceful Degradation*)**:
   Jika terjadi lonjakan kuota (*HTTP 429*) atau kendala jaringan (*HTTP 503*), fungsi `generateContentFast` secara otomatis mengalihkan permintaan ke model cadangan `gemini-flash-latest` tanpa menghentikan pengalaman pengguna.

---

## 9. PANDUAN PRESENTASI DAN DEMONSTRASI PRODUK

Berikut rancangan susunan slide dan alur demo untuk sesi presentasi:

| Slide | Topik / Judul Slide | Poin Utama yang Disampaikan | Panduan Live Demo |
|---|---|---|---|
| **Slide 1** | Judul & Pengenalan Tim | Judul proyek: EduSmart AI, logo, nama anggota kelompok dan peran masing-masing. | Tampilkan halaman Beranda (*Landing Page*). |
| **Slide 2** | Permasalahan & Urgensi | Kebutuhan belajar adaptif siswa Indonesia (SMP, SMA, Kuliah), keterbatasan tutor 1-on-1, isu latensi AI lama. | Tunjukkan *selector* jenjang pendidikan di Navbar. |
| **Slide 3** | Solusi EduSmart AI | Platform all-in-one: Tutor Cerdas, Rangkuman Instan, Kuis Adaptif, dan Evaluasi Otomatis. | Ajak audiens melihat transisi antar halaman. |
| **Slide 4** | Demonstrasi Fitur 1: AI Tutor | Streaming jawaban real-time (SSE), kursor ketik hidup, fitur Stop Streaming, dan referensi pustaka. | Ketik pertanyaan Fisika/Matematika, demonstrasikan kecepatan streaming. |
| **Slide 5** | Demonstrasi Fitur 2: Rangkuman | Penempelan materi teks panjang menjadi intisari terstruktur dan rasio kompresi kata. | Tempel materi 300 kata, buat rangkuman dalam format Markdown. |
| **Slide 6** | Demonstrasi Fitur 3: Kuis & Evaluasi | Generator kuis berbasis skema JSON, pengerjaan kuis interaktif, perhitungan skor instan, dan pembahasan. | Generate 3 soal, kerjakan langsung, kumpulkan dan tunjukkan pembahasan nomor yang keliru. |
| **Slide 7** | Arsitektur & Keamanan | Backend proxy Express, perlindungan kunci rahasia API, SSE pipeline, dan penyimpanan persisten `db.json`. | Jelaskan diagram arsitektur sistem. |
| **Slide 8** | Pengujian & Kualitas Kode | 9 Unit Tests Vitest berhasil 100%, kompilasi TypeScript bersih, performa latensi respons rendah. | Tunjukkan bukti laporan pengujian. |
| **Slide 9** | Kesimpulan & Rencana Lanjutan | Dampak efisiensi belajar, rencana integrasi voice-to-text, pengenalan rumus via kamera, dan gamifikasi lencana. | Ringkas poin kunci pencapaian tim. |
| **Slide 10** | Sesi Tanya Jawab (Q&A) | Penutup dan pembagian tautan web demo kepada audiens/dosen. | Buka ruang pertanyaan dari dosen/audiens. |

---

## 10. PEMBAGIAN TUGAS DAN KONTRIBUSI ANGGOTA KELOMPOK

| No | Nama Mahasiswa | Peran (*Role*) | Rincian Kontribusi & Tugas yang Diselesaikan | Persentase |
|---|---|---|---|---|
| 1 | **Gina Azzahra** | **Project Leader & AI Fullstack Integrator** | - Memimpin perencanaan arsitektur proyek dan koordinasi sprint.<br>- Implementasi integrasi Google GenAI SDK di sisi backend (`server.ts`).<br>- Merancang pipeline Server-Sent Events (SSE) streaming untuk respons instan.<br>- Konfigurasi fallback model dan mitigasi error kuota. | **30%** |
| 2 | **Anggota 2** | **Frontend Engineer & UI Specialist** | - Merancang desain antarmuka responsif bernuansa Biru-Putih-Navy.<br>- Membangun komponen interaktif: Navbar, TutorView, SummarizeView, QuizView, dan MarkdownRenderer.<br>- Mengembangkan animasi feedback progresif dan indikator kursor streaming. | **25%** |
| 3 | **Anggota 3** | **Backend & Prompt Engineer** | - Merancang instruksi sistem (System Instruction) berjenjang (SMP, SMA, Kuliah).<br>- Menyusun skema data JSON terstruktur untuk kuis pilihan ganda.<br>- Mengimplementasikan database persisten lokal (`data/db.json`) dan endpoint riwayat.<br>- Optimasi parameter `ThinkingLevel.LOW` untuk latensi rendah. | **25%** |
| 4 | **Anggota 4** | **Quality Assurance & Content Specialist** | - Menyusun dataset pengujian materi kurikulum Indonesia (SMP, SMA, Kuliah).<br>- Menulis kode pengujian unit otomatis (`quizUtils.test.ts`, `summaryUtils.test.ts`).<br>- Melakukan pengujian fungsional black-box dan validasi masukan kosong.<br>- Menyusun dokumentasi teknis dan laporan akhir proyek. | **20%** |

---

## 11. KESIMPULAN DAN RENCANA PENGEMBANGAN SELANJUTNYA

### 11.1. Kesimpulan
Proyek pengembangan website **EduSmart AI** telah berhasil diselesaikan dengan memenuhi seluruh kriteria fungsional dan teknis yang disyaratkan. Melalui kombinasi React 19, TypeScript, Tailwind CSS, Express backend proxy, serta Google Gemini 3.8 Flash SDK, aplikasi mampu memberikan bantuan belajar personal yang responsif, terstruktur, aman dari kebocoran kunci API, dan bebas dari persepsi aplikasi macet berkat implementasi streaming respons Server-Sent Events (SSE).

### 11.2. Rencana Pengembangan Selanjutnya (Next Roadmap)
1. **Interaksi Suara (Voice-to-Speech & Speech-to-Text)**: Memungkinkan siswa berdiskusi dengan AI Tutor menggunakan perintah suara langsung.
2. **Pengenalan Rumus & Gambar Soal (Multimodal OCR)**: Fitur unggah foto lembar soal matematika atau fisika yang langsung dianalisis oleh AI.
3. **Penyimpanan Multi-Akun Cloud**: Integrasi Firebase Authentication untuk sinkronisasi riwayat belajar antar gawai (*cross-device*).
4. **Sistem Peringkat & Gamifikasi (*Gamified Leaderboard*)**: Memberikan lencana prestasi (*badges*) dan poin pengalaman (*EXP*) untuk memacu motivasi belajar.

---

### Tautan Akses & Berkas Proyek:
- **Aplikasi Online**: `https://ais-pre-vdb5ab76a2eb2vv3uobsbr-572611332815.asia-east1.run.app`
- **Lingkungan Kerja**: Node.js & React SPA (Port 3000)
- **Status Build**: ✅ Build Succeeded & All 9 Tests Passed
