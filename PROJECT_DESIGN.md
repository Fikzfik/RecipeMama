# Perancangan dan Deskripsi Implementasi: Food Recipe Explorer

## 1. Pendahuluan
Food Recipe Explorer adalah aplikasi web frontend sederhana yang memungkinkan pengguna untuk menjelajahi berbagai resep makanan. Tujuan utama dari proyek ini adalah melatih kemampuan integrasi API, manajemen state di React, dan implementasi desain UI yang bersih dan modern.

## 2. Konsep Desain UI
Desain aplikasi ini mengusung tema **Minimalist & Clean**.
- **Warna**: Dominasi warna putih (`#FFFFFF`) dan abu-abu lembut (`#F3F4F6`) sebagai background. Warna aksen (seperti oranye atau hijau muda) hanya digunakan untuk tombol aksi (CTA) atau highlighting penting agar tidak mengganggu fokus visual.
- **Tipografi**: Menggunakan font sans-serif modern (seperti Inter atau default Tailwind sans) yang mudah dibaca.
- **Layout**: 
  - `Hero Section`: Menampilkan visual menarik (menggunakan efek Parallax Scroll) untuk memberikan kesan premium.
  - `Content`: Menggunakan Grid sistem untuk kartu resep yang responsif.
  - `Detail`: Layout terstruktur dengan gambar besar di sisi kiri/atas dan informasi detail di sisi kanan/bawah.

## 3. Struktur Halaman & Komponen
Aplikasi terdiri dari komponen-komponen utama berikut:

### Halaman Utama (`/`)
- **Header/Navbar**: Judul aplikasi dan Navigasi sederhana.
- **Hero Section**: Implementasi `ParallaxScroll` menampilkan galeri makanan yang menggugah selera.
- **Search Bar**: Input field untuk mencari resep (Live search atau submit).
- **Recipe List**: Grid yang menampilkan `RecipeCard`.
    - **RecipeCard**: Komponen kartu yang berisi:
        - Gambar (Image)
        - Judul Resep (Title)
        - Rating/Waktu masak (Badge sederhana)

### Halaman Detail (`/recipe/[id]`)
- **Hero Detail**: Gambar utama makanan.
- **Info Section**: Judul, Kategori, Area (Asal makanan).
- **Ingredients List**: Daftar bahan-bahan dalam bentuk list checklist.
- **Instructions**: Langkah-langkah memasak.

## 4. Alur Data dan State Management
- **Fetching Data**: Menggunakan `Axios` untuk mengambil data dari API publik (contoh: `https://dummyjson.com/recipes` atau `TheMealDB`).
- **State**:
  - `recipes`: `Array` - menyimpan daftar resep yang diambil dari API.
  - `loading`: `Boolean` - indikator saat data sedang diambil.
  - `searchQuery`: `String` - menyimpan input pencarian pengguna.
  - `selectedRecipe`: `Object` - menyimpan detail resep (jika menggunakan modal) atau diambil via dynamic routing.
- **Props**: Komponen `RecipeCard` akan menerima props `recipe` (objek) untuk merender informasi.

## 5. Implementasi Teknis (Frontend Focus)
- **Framework**: Next.js (React) App Router.
- **Styling**: TailwindCSS.
- **Data Fetching**: useEffect hook untuk fetch awal dan saat search query berubah.
- **Interaktivitas**: Efek parallax menggunakan `framer-motion` untuk pengalaman scroll yang halus.

---

Proyek ini tidak memerlukan backend (server-side logic untuk database), melainkan fokus pada bagaimana Frontend "berbicara" dengan API eksternal dan menyajikannya kepada pengguna dengan indah.
