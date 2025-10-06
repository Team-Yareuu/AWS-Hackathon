# JSON Validation Tool

A simple Python script to check your recipe JSON files for errors before migration.

## 🚀 Quick Start

```bash
# Check the default sample_recipes.json
python check_json.py

# Check a specific JSON file
python check_json.py path/to/your/recipe.json
```

## ✅ What It Checks

### 1. JSON Syntax ✓
- Valid JSON format
- Proper brackets and braces
- Correct comma usage
- No trailing commas
- Proper string quotes

**Example Error Output:**
```
❌ JSON SYNTAX ERROR!

Error: Expecting ',' delimiter
Line: 45
Column: 12

Context around error:
    42 |       "name": "Rendang"
    43 |       "region": "Sumatera Barat"
>>> 44 |       "difficulty": "Sedang"
           ^ ERROR HERE
    45 |     },
```

### 2. Recipe Structure ✓
- All required fields present
- Correct data types
- Valid difficulty values ("Mudah", "Sedang", "Sulit")
- Proper array structures for ingredients and steps
- Sequential cooking step numbers

**Example Output:**
```
Recipe #1 (ID: 1): Rendang Daging Sapi
   ✅ All required fields present

Recipe #2 (ID: 2): Gado-Gado
   ❌ Missing required fields: cookingTimeMinutes, estimatedCost
   ❌ 'difficulty' should be 'Mudah', 'Sedang', or 'Sulit', got 'Easy'
```

### 3. Duplicate IDs ✓
- Ensures each recipe has a unique ID

## 📋 Required Fields

Every recipe MUST have these fields:

```json
{
  "id": "1",
  "name": "Recipe Name",
  "shortDescription": "Brief description",
  "description": "Full description",
  "image": "image URL or path",
  "region": "Region name",
  "difficulty": "Mudah|Sedang|Sulit",
  "cookingTimeMinutes": 60,
  "servings": 4,
  "estimatedCost": 50000,
  "isTraditional": true,
  "isNew": false,
  "ingredients": [...],
  "cookingSteps": [...]
}
```

## 🎯 Common Errors & Fixes

### Missing Comma
```json
// ❌ Wrong
{
  "name": "Rendang"
  "region": "Sumatera"
}

// ✅ Correct
{
  "name": "Rendang",
  "region": "Sumatera"
}
```

### Trailing Comma
```json
// ❌ Wrong
{
  "name": "Rendang",
  "region": "Sumatera",
}

// ✅ Correct
{
  "name": "Rendang",
  "region": "Sumatera"
}
```

### Wrong Data Type
```json
// ❌ Wrong
{
  "cookingTimeMinutes": "60",
  "servings": "4"
}

// ✅ Correct
{
  "cookingTimeMinutes": 60,
  "servings": 4
}
```

### Invalid Difficulty
```json
// ❌ Wrong
{
  "difficulty": "Easy"
}

// ✅ Correct
{
  "difficulty": "Mudah"
}
```

### Wrong Step Numbers
```json
// ❌ Wrong
"cookingSteps": [
  { "step": 1, ... },
  { "step": 3, ... },  // Missing step 2!
  { "step": 4, ... }
]

// ✅ Correct
"cookingSteps": [
  { "step": 1, ... },
  { "step": 2, ... },
  { "step": 3, ... }
]
```

## 💡 Usage Tips

### Before Migration
Always run this check before migrating:
```bash
python check_json.py app/data/sample_recipes.json
```

### After Editing
Check your changes immediately:
```bash
python check_json.py
```

### Check Multiple Files
```bash
python check_json.py recipe1.json
python check_json.py recipe2.json
python check_json.py recipe3.json
```

## 🎨 Output Examples

### ✅ All Checks Pass
```
================================================================================
FINAL RESULT
================================================================================

✅ ALL CHECKS PASSED!
   Your JSON file is valid and ready for migration.
```

### ❌ Errors Found
```
================================================================================
FINAL RESULT
================================================================================

❌ VALIDATION FAILED
   - Fix recipe structure errors
   - Remove duplicate IDs

Please fix the errors and run this script again.
```

## 🛠️ No Dependencies Required

This script uses only Python standard library - no pip install needed!

## 📝 Next Steps

After your JSON passes all checks:

1. ✅ **JSON is valid** → Ready for migration
2. Run the migration:
   ```bash
   cd app
   python -m app.migration
   ```

## 🆘 Need Help?

If you see an error you don't understand:

1. Look at the **line number** and **column** shown
2. Check the **context** printed around the error
3. Read the **error message** - it tells you what's wrong
4. Look at the **Common Errors & Fixes** section above

## 📚 Related Files

- `app/data/sample_recipes.json` - Recipe data file
- `app/data/recipe_schema.json` - Full JSON schema
- `app/validate_recipes.py` - Advanced validation with schema
- `app/data/VALIDATION_README.md` - Detailed validation docs
