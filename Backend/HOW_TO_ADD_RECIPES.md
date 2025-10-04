# How to Add More Recipes to Your Database

## 📍 Current Status

- **Current Recipes:** 1 (Rendang Daging Sapi Padang)
- **Data File:** `Backend/app/data/sample_recipes.json`
- **Database:** Neo4j Cloud

---

## 🔄 How to Add More Recipes

### Step 1: Edit the JSON File

Open `Backend/app/data/sample_recipes.json` and add new recipe objects to the array.

**Current Structure:**

```json
[
  {
    "id": "1",
    "name": "Rendang Daging Sapi Padang",
    ...
  }
]
```

**After Adding More:**

```json
[
  {
    "id": "1",
    "name": "Rendang Daging Sapi Padang",
    ...
  },
  {
    "id": "2",
    "name": "Gudeg Jogja",
    ...
  },
  {
    "id": "3",
    "name": "Soto Betawi",
    ...
  }
]
```

### Step 2: Use the Template

I've created a template file for you: `Backend/app/data/recipe_template.json`

This shows the complete structure for a new recipe including:

- Basic info (name, description, image, region)
- Difficulty & timing
- Cultural story
- Budget data (stores and prices)
- Ingredients (with categories and substitutes)
- Cooking steps (with tips)

### Step 3: Run Migration

After adding recipes, upload them to Neo4j:

```bash
# Activate conda environment
conda activate hackathon

# Go to Backend folder
cd Backend

# Run migration script
python -m app.migration
```

**What it does:**

- ✅ Connects to Neo4j
- ✅ Clears existing data
- ✅ Uploads ALL recipes from `sample_recipes.json`
- ✅ Creates all relationships (ingredients, stores, steps, etc.)

### Step 4: Verify

Test if recipes were added:

```bash
# Test the database
python test_neo4j_data.py

# Or test via API
python test_api.py
```

---

## 📋 Recipe Data Structure

### Required Fields:

```json
{
  "id": "unique_number",           // Must be unique
  "name": "Recipe Name",            // Required
  "shortDescription": "Brief desc", // Required
  "description": "Full desc",       // Required
  "image": "url",                   // Recommended
  "region": "Region Name",          // Required
  "difficulty": "Mudah/Sedang/Sulit", // Required
  "cookingTimeMinutes": 60,         // Number
  "servings": 4,                    // Number
  "estimatedCost": 50000,          // Number (Rupiah)
  "isTraditional": true,           // Boolean
  "isNew": false                   // Boolean
}
```

### Optional But Recommended:

- `culturalStory` - Adds cultural context
- `budgetData` - Offline stores and prices
- `ingredients` - List of ingredients with categories
- `cookingSteps` - Step-by-step cooking instructions

---

## 🎯 Example: Adding a Simple Recipe

### Minimal Recipe (Just Basic Info):

```json
{
  "id": "2",
  "name": "Nasi Goreng Spesial",
  "shortDescription": "Nasi goreng dengan telur dan ayam",
  "description": "Nasi goreng dengan bumbu kecap manis, telur mata sapi, dan ayam suwir",
  "image": "https://example.com/nasi-goreng.jpg",
  "region": "Jawa Tengah",
  "difficulty": "Mudah",
  "cookingTimeMinutes": 30,
  "servings": 2,
  "estimatedCost": 25000,
  "isTraditional": true,
  "isNew": false,
  "culturalStory": null,
  "budgetData": null,
  "ingredients": [],
  "cookingSteps": []
}
```

Just add this object to the array in `sample_recipes.json`, then run migration!

---

## ✅ Quick Checklist

- [ ] Open `Backend/app/data/sample_recipes.json`
- [ ] Copy the template from `recipe_template.json`
- [ ] Fill in the recipe details
- [ ] Make sure `"id"` is unique
- [ ] Add it to the array (don't forget the comma!)
- [ ] Run `python -m app.migration`
- [ ] Test with `python test_neo4j_data.py`
- [ ] Check the frontend: `http://localhost:4028/api-test`

---

## 🚀 Quick Commands

```bash
# Add recipes to sample_recipes.json, then:

# 1. Upload to database
conda activate ai && cd Backend && python -m app.migration

# 2. Test database
python test_neo4j_data.py

# 3. Test API
python test_api.py

# 4. View in frontend
# Open: http://localhost:4028/api-test
```

---

## 📝 Tips

1. **IDs must be unique** - Use "1", "2", "3", etc.
2. **Use valid JSON** - Check for missing commas, brackets
3. **Test after adding** - Always run migration and test
4. **Start simple** - Add basic info first, then add details later
5. **Images** - Use public URLs or leave as placeholder

---

## 🎨 Where Recipes Appear

After adding recipes, they will show up in:

1. **API Test Page** - `http://localhost:4028/api-test`
2. **Recipe Detail** - `http://localhost:4028/recipe-detail/{id}`
3. **API Endpoints** - `http://localhost:8000/api/v1/recipes/`

---

## ⚠️ Important Notes

- Migration **clears all existing data** before uploading
- Always backup `sample_recipes.json` before major changes
- If migration fails, check your JSON syntax
- All recipes must follow the same structure

---

## 🆘 Troubleshooting

**Problem:** Migration fails

- **Solution:** Check JSON syntax at https://jsonlint.com

**Problem:** Recipes not showing

- **Solution:** Restart backend server and clear browser cache

**Problem:** Duplicate ID error

- **Solution:** Make sure each recipe has a unique ID

---

Happy cooking! 🍳
