# Recipe Validator

Script Python untuk memvalidasi struktur JSON resep dalam project AI Resepku.

## Tujuan

Memastikan semua resep mengikuti standar struktur ingredients dengan hanya 2 kategori:
- `bahan_utama` - Bahan utama dan pelengkap
- `bumbu` - Bumbu dan rempah-rempah

## Penggunaan

### Menjalankan Validator

```bash
# Dari root project
cd Backend
python -m app.utils.recipe_validator

# Atau dengan path spesifik
python -m app.utils.recipe_validator path/to/recipes.json
```

### Import sebagai Module

```python
from app.utils.recipe_validator import validate_recipe_file, print_validation_results

results = validate_recipe_file('path/to/recipes.json')
print_validation_results(results)

if results['invalid_recipes'] > 0:
    print("Ada resep yang perlu diperbaiki!")
```

## Validasi yang Dilakukan

### 1. Struktur Kategori Ingredients
- ✅ Hanya boleh ada 2 kategori: `bahan_utama` dan `bumbu`
- ❌ Kategori yang TIDAK diperbolehkan:
  - `bumbu_halus` (harus digabung ke `bumbu`)
  - `bumbu_lain` (harus digabung ke `bumbu`)
  - `pelengkap` (harus digabung ke `bahan_utama`)
  - `koya` (harus digabung ke `bahan_utama` atau `bumbu`)
  - Kategori custom lainnya

### 2. Struktur Item Ingredient
Setiap item harus memiliki:
- `name` (string) - Nama bahan
- `quantity` (object) - Jumlah bahan
  - `value` (number/null) - Nilai jumlah
  - `unit` (string) - Satuan (gram, sdm, buah, dll)
- `notes` (string, optional) - Catatan tambahan
- `substitutes` (array, optional) - Alternatif bahan

### 3. Validasi Quantity
- Quantity harus berupa object
- Harus memiliki field `unit`
- Field `value` bisa null untuk "secukupnya"

## Output Validator

```
================================================================================
RECIPE VALIDATION RESULTS
================================================================================

Total Recipes: 12
✅ Valid Recipes: 12
❌ Invalid Recipes: 0

================================================================================
🎉 ALL RECIPES ARE VALID! 🎉
================================================================================
```

Jika ada error:

```
================================================================================
ERRORS FOUND:
================================================================================

1. Recipe 3 (Soto Ayam Lamongan): Found invalid categories: bumbu_halus, pelengkap
   Only 'bahan_utama' and 'bumbu' are allowed.

2. Recipe 5 (Asam Padeh): 'Cabai Merah' in 'bumbu' missing fields: quantity
```

## Contoh Struktur yang Benar

```json
{
  "id": "1",
  "name": "Rendang Daging Sapi",
  "ingredients": [
    {
      "bahan_utama": [
        {
          "name": "Daging sapi",
          "quantity": {
            "value": 1000,
            "unit": "gram"
          },
          "notes": "Potong dadu",
          "substitutes": ["Daging kambing"]
        }
      ],
      "bumbu": [
        {
          "name": "Bawang merah",
          "quantity": {
            "value": 10,
            "unit": "siung"
          },
          "notes": "Haluskan"
        }
      ]
    }
  ]
}
```

## Integration dengan CI/CD

Tambahkan di GitHub Actions atau pipeline CI/CD:

```yaml
- name: Validate Recipe Structure
  run: |
    cd Backend
    python -m app.utils.recipe_validator
```

Script akan exit dengan code 1 jika ada error, sehingga pipeline akan gagal.

## Catatan Migrasi

Saat menggabungkan kategori:
- Tambahkan `notes: "Haluskan"` untuk bumbu yang perlu dihaluskan
- Tambahkan `notes: "Untuk pelengkap"` atau `notes: "Untuk taburan"` untuk item dari kategori `pelengkap`
- Gabungkan `koya` ke `bahan_utama` dengan notes yang jelas (contoh: "Kerupuk Udang (untuk koya)")

## Troubleshooting

### Error: "Found invalid categories"
**Solusi**: Pindahkan item dari kategori tersebut ke `bahan_utama` atau `bumbu`

### Error: "Missing required categories"
**Solusi**: Pastikan ada minimal 1 item di `bahan_utama` dan `bumbu`

### Error: "quantity missing 'unit' field"
**Solusi**: Tambahkan field `unit` di quantity, gunakan "secukupnya" jika tidak ada satuan pasti

## Maintenance

File ini harus dijalankan setiap kali:
- Menambah resep baru
- Mengubah struktur resep
- Sebelum commit ke repository
- Dalam proses code review

## Author

Tim AI Resepku - AWS Hackathon 2025
