"""
Recipe JSON Structure Validator
Validates that all recipes follow the correct structure with only two ingredient categories.
"""
import json
from typing import Dict, List, Tuple, Any


def check_ingredients_structure(recipe: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Check if recipe ingredients have only 'bahan_utama' and 'bumbu' categories.
    
    Args:
        recipe: Recipe dictionary
        
    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors = []
    recipe_id = recipe.get('id', 'Unknown')
    recipe_name = recipe.get('name', 'Unknown')
    
    if 'ingredients' not in recipe:
        errors.append(f"Recipe {recipe_id} ({recipe_name}): Missing 'ingredients' field")
        return False, errors
    
    if not isinstance(recipe['ingredients'], list) or len(recipe['ingredients']) == 0:
        errors.append(f"Recipe {recipe_id} ({recipe_name}): 'ingredients' must be a non-empty list")
        return False, errors
    
    ingredient_obj = recipe['ingredients'][0]
    
    # Get all keys in the ingredients object
    ingredient_keys = set(ingredient_obj.keys())
    
    # Expected keys
    expected_keys = {'bahan_utama', 'bumbu'}
    
    # Invalid keys (categories that should have been merged)
    invalid_keys = {'bumbu_halus', 'bumbu_lain', 'pelengkap', 'koya', 'bumbu_tambahan'}
    
    # Check for invalid keys
    found_invalid = ingredient_keys.intersection(invalid_keys)
    if found_invalid:
        errors.append(
            f"Recipe {recipe_id} ({recipe_name}): Found invalid categories: {', '.join(found_invalid)}. "
            f"Only 'bahan_utama' and 'bumbu' are allowed."
        )
    
    # Check if required keys exist
    missing_keys = expected_keys - ingredient_keys
    if missing_keys:
        errors.append(
            f"Recipe {recipe_id} ({recipe_name}): Missing required categories: {', '.join(missing_keys)}"
        )
    
    # Check for extra unexpected keys (excluding valid ones)
    extra_keys = ingredient_keys - expected_keys - invalid_keys
    if extra_keys:
        errors.append(
            f"Recipe {recipe_id} ({recipe_name}): Found unexpected categories: {', '.join(extra_keys)}"
        )
    
    is_valid = len(errors) == 0
    return is_valid, errors


def check_ingredient_items(recipe: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Check if ingredient items have required fields.
    
    Args:
        recipe: Recipe dictionary
        
    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors = []
    recipe_id = recipe.get('id', 'Unknown')
    recipe_name = recipe.get('name', 'Unknown')
    
    if 'ingredients' not in recipe or not recipe['ingredients']:
        return True, []  # Already checked in structure validation
    
    ingredient_obj = recipe['ingredients'][0]
    required_fields = {'name', 'quantity'}
    
    for category in ['bahan_utama', 'bumbu']:
        if category not in ingredient_obj:
            continue
            
        items = ingredient_obj[category]
        if not isinstance(items, list):
            errors.append(
                f"Recipe {recipe_id} ({recipe_name}): '{category}' must be a list"
            )
            continue
        
        for idx, item in enumerate(items):
            if not isinstance(item, dict):
                errors.append(
                    f"Recipe {recipe_id} ({recipe_name}): Item {idx} in '{category}' must be an object"
                )
                continue
            
            # Check required fields
            missing_fields = required_fields - set(item.keys())
            if missing_fields:
                item_name = item.get('name', f'item {idx}')
                errors.append(
                    f"Recipe {recipe_id} ({recipe_name}): '{item_name}' in '{category}' "
                    f"missing fields: {', '.join(missing_fields)}"
                )
            
            # Check quantity structure
            if 'quantity' in item:
                qty = item['quantity']
                if not isinstance(qty, dict):
                    errors.append(
                        f"Recipe {recipe_id} ({recipe_name}): '{item.get('name', 'unknown')}' in '{category}' "
                        f"has invalid quantity format (must be an object)"
                    )
                elif 'unit' not in qty:
                    errors.append(
                        f"Recipe {recipe_id} ({recipe_name}): '{item.get('name', 'unknown')}' in '{category}' "
                        f"quantity missing 'unit' field"
                    )
    
    is_valid = len(errors) == 0
    return is_valid, errors


def validate_recipe_file(file_path: str) -> Dict[str, Any]:
    """
    Validate entire recipe JSON file.
    
    Args:
        file_path: Path to the recipe JSON file
        
    Returns:
        Dictionary with validation results
    """
    results = {
        'total_recipes': 0,
        'valid_recipes': 0,
        'invalid_recipes': 0,
        'errors': [],
        'warnings': []
    }
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            recipes = json.load(f)
    except json.JSONDecodeError as e:
        results['errors'].append(f"JSON parsing error: {str(e)}")
        return results
    except FileNotFoundError:
        results['errors'].append(f"File not found: {file_path}")
        return results
    
    if not isinstance(recipes, list):
        results['errors'].append("Root element must be an array of recipes")
        return results
    
    results['total_recipes'] = len(recipes)
    
    for recipe in recipes:
        recipe_errors = []
        
        # Check structure
        is_valid_structure, structure_errors = check_ingredients_structure(recipe)
        recipe_errors.extend(structure_errors)
        
        # Check ingredient items
        is_valid_items, item_errors = check_ingredient_items(recipe)
        recipe_errors.extend(item_errors)
        
        if recipe_errors:
            results['invalid_recipes'] += 1
            results['errors'].extend(recipe_errors)
        else:
            results['valid_recipes'] += 1
    
    return results


def print_validation_results(results: Dict[str, Any]) -> None:
    """
    Print validation results in a readable format.
    
    Args:
        results: Validation results dictionary
    """
    print("=" * 80)
    print("RECIPE VALIDATION RESULTS")
    print("=" * 80)
    print(f"\nTotal Recipes: {results['total_recipes']}")
    print(f"✅ Valid Recipes: {results['valid_recipes']}")
    print(f"❌ Invalid Recipes: {results['invalid_recipes']}")
    
    if results['errors']:
        print(f"\n{'=' * 80}")
        print("ERRORS FOUND:")
        print("=" * 80)
        for idx, error in enumerate(results['errors'], 1):
            print(f"\n{idx}. {error}")
    
    if results['warnings']:
        print(f"\n{'=' * 80}")
        print("WARNINGS:")
        print("=" * 80)
        for idx, warning in enumerate(results['warnings'], 1):
            print(f"\n{idx}. {warning}")
    
    if results['valid_recipes'] == results['total_recipes']:
        print(f"\n{'=' * 80}")
        print("🎉 ALL RECIPES ARE VALID! 🎉")
        print("=" * 80)
    else:
        print(f"\n{'=' * 80}")
        print(f"⚠️  {results['invalid_recipes']} recipe(s) need fixing")
        print("=" * 80)


if __name__ == "__main__":
    import sys
    import os
    
    # Default file path
    default_path = os.path.join(
        os.path.dirname(__file__),
        '..',
        'data',
        'sample_recipes.json'
    )
    
    file_path = sys.argv[1] if len(sys.argv) > 1 else default_path
    
    print(f"\nValidating: {file_path}\n")
    
    results = validate_recipe_file(file_path)
    print_validation_results(results)
    
    # Exit with error code if validation failed
    sys.exit(0 if results['invalid_recipes'] == 0 else 1)
