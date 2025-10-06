# Recipe Data Validation

This directory contains tools for validating recipe JSON data before migration to Neo4j.

## 📋 Overview

The validation system ensures that all recipe data conforms to the defined schema and meets quality standards before being migrated to the database. This prevents data integrity issues and catches errors early in the development process.

## 🗂️ Files

- **`recipe_schema.json`** - JSON Schema definition for recipe data
- **`sample_recipes.json`** - Recipe data to be validated and migrated
- **`validation_report.json`** - Generated report (created after validation)
- **`recipe_template.json`** - Template for creating new recipes

## 🚀 Usage

### Quick Validation

Run validation from the `Backend/app` directory:

```bash
# Validate default data file
python validate_data.py

# Validate specific file
python validate_data.py --data path/to/your/recipes.json

# Use custom schema
python validate_data.py --schema custom_schema.json --data recipes.json
```

### During Migration

The validation is automatically run when you execute the migration script:

```bash
python -m app.migration
```

If validation fails, the migration will stop and show you the errors.

## ✅ What Gets Validated

### Schema Validation

The validator checks that each recipe has:

- ✅ **Required fields**: id, name, description, region, difficulty, etc.
- ✅ **Correct data types**: strings, numbers, booleans, arrays, objects
- ✅ **Valid enums**: difficulty must be "Mudah", "Sedang", or "Sulit"
- ✅ **Valid ranges**: cooking time (1-1440 min), servings (1-100), etc.
- ✅ **Proper structure**: ingredients, cooking steps, cultural story, etc.

### Data Quality Checks

Additional quality checks include:

- 🔍 **No duplicate IDs**: Each recipe must have a unique ID
- 🔍 **Step ordering**: Cooking steps must be numbered sequentially (1, 2, 3...)
- 🔍 **Cost consistency**: Estimated cost should match sum of ingredient prices (±20%)
- 🔍 **Empty arrays**: No empty substitutes or other empty arrays
- 🔍 **Missing optional data**: Warns about missing cultural stories

## 📊 Validation Report

After validation, a detailed report is saved to `validation_report.json`:

```json
{
  "timestamp": "2025-10-05T10:30:00",
  "total_recipes": 10,
  "valid_recipes": 10,
  "invalid_recipes": 0,
  "validation_results": [ ... ],
  "quality_issues": [ ... ]
}
```

## 🐛 Common Validation Errors

### Missing Required Field
```
❌ Recipe 1 (ID: 1): Rendang
   ⚠️  root: 'cookingTimeMinutes' is a required property
```
**Fix**: Add the missing field to the recipe object.

### Invalid Data Type
```
❌ Recipe 2 (ID: 2): Gado-Gado
   ⚠️  servings: 'empat' is not of type 'integer'
```
**Fix**: Change `"servings": "empat"` to `"servings": 4`

### Invalid Enum Value
```
❌ Recipe 3 (ID: 3): Soto
   ⚠️  difficulty: 'gampang' is not one of ['Mudah', 'Sedang', 'Sulit']
```
**Fix**: Use correct difficulty value: "Mudah", "Sedang", or "Sulit"

### Step Order Mismatch
```
⚠️  Rendang: Step order issue at step 2
```
**Fix**: Ensure cooking steps are numbered 1, 2, 3, 4... without gaps.

## 📝 Recipe Schema Structure

```json
{
  "id": "1",
  "name": "Recipe Name",
  "shortDescription": "Brief description",
  "description": "Full description",
  "image": "url or path",
  "region": "Region name",
  "difficulty": "Mudah|Sedang|Sulit",
  "cookingTimeMinutes": 60,
  "servings": 4,
  "estimatedCost": 50000,
  "isTraditional": true,
  "isNew": false,
  "culturalStory": { ... },
  "budgetData": { ... },
  "ingredients": [ ... ],
  "cookingSteps": [ ... ]
}
```

See `recipe_schema.json` for complete schema definition.

## 🔧 Adding New Validation Rules

To add custom validation rules:

1. **Update Schema**: Edit `recipe_schema.json` to add new constraints
2. **Add Quality Checks**: Edit `validate_recipes.py` -> `check_data_quality()` method
3. **Test**: Run validation on sample data

Example - Adding price range check:

```python
# In check_data_quality() method
if recipe.get('estimatedCost', 0) > 500000:
    issue = {
        'recipe_id': recipe_id,
        'recipe_name': recipe_name,
        'type': 'price_too_high',
        'message': f'Price exceeds maximum: {recipe["estimatedCost"]}'
    }
    quality_issues.append(issue)
```

## 🎯 Integration with CI/CD

You can integrate validation into your CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Validate Recipe Data
  run: |
    cd Backend/app
    python validate_data.py
    if [ $? -ne 0 ]; then
      echo "Validation failed!"
      exit 1
    fi
```

## 📚 References

- [JSON Schema Documentation](https://json-schema.org/)
- [jsonschema Python Library](https://python-jsonschema.readthedocs.io/)
- [Neo4j Data Modeling Best Practices](https://neo4j.com/developer/data-modeling/)

## 🆘 Troubleshooting

### "jsonschema not installed"
```bash
pip install jsonschema
```

### "Schema file not found"
Make sure you're running the script from the correct directory:
```bash
cd Backend/app
python validate_data.py
```

### "All recipes failed validation"
Check that your JSON file is properly formatted:
```bash
python -m json.tool sample_recipes.json
```

## ✨ Example: Creating a New Recipe

Use the template and validate it:

```bash
# Copy template
cp data/recipe_template.json data/my_recipe.json

# Edit your recipe
# ... add your data ...

# Validate
python validate_data.py --data data/my_recipe.json
```

If validation passes, your recipe is ready to be added to `sample_recipes.json`!
