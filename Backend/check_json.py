#!/usr/bin/env python3
"""
Simple JSON Validator for Recipe Data
Checks for JSON syntax errors and shows exactly where they are.

Usage:
    python check_json.py
    python check_json.py path/to/your/recipe.json
"""
import json
import sys
from pathlib import Path
from typing import Optional


def check_json_syntax(file_path: Path) -> bool:
    """
    Check if JSON file has valid syntax.
    Returns True if valid, False otherwise.
    """
    print(f"\n{'='*80}")
    print(f"CHECKING JSON FILE: {file_path.name}")
    print(f"{'='*80}\n")
    
    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Try to parse JSON
        data = json.loads(content)
        
        print(f"✅ JSON syntax is valid!")
        print(f"\n📊 File Statistics:")
        print(f"   - File size: {len(content):,} bytes")
        print(f"   - Lines: {content.count(chr(10)) + 1:,}")
        
        if isinstance(data, list):
            print(f"   - Type: Array")
            print(f"   - Items: {len(data)}")
        elif isinstance(data, dict):
            print(f"   - Type: Object")
            print(f"   - Keys: {len(data)}")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON SYNTAX ERROR!\n")
        print(f"Error: {e.msg}")
        print(f"Line: {e.lineno}")
        print(f"Column: {e.colno}")
        print(f"Position: {e.pos}\n")
        
        # Show context around the error
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Show 3 lines before and after the error
        start_line = max(0, e.lineno - 4)
        end_line = min(len(lines), e.lineno + 3)
        
        print("Context around error:")
        print("-" * 80)
        for i in range(start_line, end_line):
            line_num = i + 1
            line = lines[i].rstrip()
            
            if line_num == e.lineno:
                print(f">>> {line_num:4d} | {line}")
                # Show pointer to exact column
                pointer_line = " " * (len(f"{line_num:4d} | ") + e.colno - 1) + "^"
                print(f"    {pointer_line} ERROR HERE")
            else:
                print(f"    {line_num:4d} | {line}")
        print("-" * 80)
        
        # Common error hints
        print("\n💡 Common JSON Errors:")
        if "Expecting" in e.msg:
            print("   - Missing comma between array/object elements")
            print("   - Missing closing bracket ] or brace }")
            print("   - Extra comma at the end of array/object")
        if "control character" in e.msg:
            print("   - Invalid character in string (use escape sequences)")
        if "property name" in e.msg:
            print("   - Object keys must be in double quotes")
        if "Unterminated string" in e.msg:
            print("   - Missing closing quote for string")
        
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def validate_recipe_structure(file_path: Path) -> bool:
    """
    Validate that the JSON contains properly structured recipe data.
    """
    print(f"\n{'='*80}")
    print(f"VALIDATING RECIPE STRUCTURE")
    print(f"{'='*80}\n")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print(f"❌ Root element should be an array of recipes, got {type(data).__name__}")
            return False
        
        print(f"✅ Root element is an array")
        print(f"📊 Found {len(data)} recipe(s)\n")
        
        errors_found = False
        
        # Check each recipe
        for idx, recipe in enumerate(data, 1):
            recipe_id = recipe.get('id', '?')
            recipe_name = recipe.get('name', '?')
            
            print(f"Recipe #{idx} (ID: {recipe_id}): {recipe_name}")
            
            # Check required fields
            required_fields = [
                'id', 'name', 'shortDescription', 'description', 'image',
                'region', 'difficulty', 'cookingTimeMinutes', 'servings',
                'estimatedCost', 'isTraditional', 'isNew', 'ingredients',
                'cookingSteps'
            ]
            
            missing_fields = []
            for field in required_fields:
                if field not in recipe:
                    missing_fields.append(field)
            
            if missing_fields:
                errors_found = True
                print(f"   ❌ Missing required fields: {', '.join(missing_fields)}")
            else:
                print(f"   ✅ All required fields present")
            
            # Check field types
            type_errors = []
            
            if 'id' in recipe and not isinstance(recipe['id'], str):
                type_errors.append(f"'id' should be string, got {type(recipe['id']).__name__}")
            
            if 'cookingTimeMinutes' in recipe and not isinstance(recipe['cookingTimeMinutes'], int):
                type_errors.append(f"'cookingTimeMinutes' should be integer, got {type(recipe['cookingTimeMinutes']).__name__}")
            
            if 'servings' in recipe and not isinstance(recipe['servings'], int):
                type_errors.append(f"'servings' should be integer, got {type(recipe['servings']).__name__}")
            
            if 'estimatedCost' in recipe and not isinstance(recipe['estimatedCost'], (int, float)):
                type_errors.append(f"'estimatedCost' should be number, got {type(recipe['estimatedCost']).__name__}")
            
            if 'difficulty' in recipe and recipe['difficulty'] not in ['Mudah', 'Sedang', 'Sulit']:
                type_errors.append(f"'difficulty' should be 'Mudah', 'Sedang', or 'Sulit', got '{recipe['difficulty']}'")
            
            if 'ingredients' in recipe and not isinstance(recipe['ingredients'], list):
                type_errors.append(f"'ingredients' should be array, got {type(recipe['ingredients']).__name__}")
            
            if 'cookingSteps' in recipe and not isinstance(recipe['cookingSteps'], list):
                type_errors.append(f"'cookingSteps' should be array, got {type(recipe['cookingSteps']).__name__}")
            
            if type_errors:
                errors_found = True
                for error in type_errors:
                    print(f"   ❌ {error}")
            
            # Check cooking steps order
            if 'cookingSteps' in recipe and isinstance(recipe['cookingSteps'], list):
                steps = recipe['cookingSteps']
                for i, step in enumerate(steps, 1):
                    if step.get('step') != i:
                        errors_found = True
                        print(f"   ❌ Step {i} has wrong step number: {step.get('step')}")
                        break
            
            print()
        
        if not errors_found:
            print("🎉 All recipes have valid structure!")
            return True
        else:
            print("⚠️  Some recipes have structure errors (see above)")
            return False
            
    except Exception as e:
        print(f"❌ Error validating structure: {e}")
        return False


def check_duplicate_ids(file_path: Path) -> bool:
    """Check for duplicate recipe IDs"""
    print(f"\n{'='*80}")
    print(f"CHECKING FOR DUPLICATE IDs")
    print(f"{'='*80}\n")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            return True
        
        ids = [recipe.get('id') for recipe in data]
        seen = set()
        duplicates = []
        
        for recipe_id in ids:
            if recipe_id in seen:
                duplicates.append(recipe_id)
            seen.add(recipe_id)
        
        if duplicates:
            print(f"❌ Found duplicate IDs: {', '.join(str(d) for d in duplicates)}")
            return False
        else:
            print(f"✅ No duplicate IDs found")
            return True
            
    except Exception as e:
        print(f"❌ Error checking duplicates: {e}")
        return False


def main():
    """Main entry point"""
    # Determine file path
    if len(sys.argv) > 1:
        file_path = Path(sys.argv[1])
    else:
        # Default to sample_recipes.json
        file_path = Path(__file__).parent / "app" / "data" / "sample_recipes.json"
    
    print(f"\n{'='*80}")
    print(f"JSON VALIDATION TOOL")
    print(f"{'='*80}")
    print(f"File: {file_path}")
    
    # Step 1: Check JSON syntax
    syntax_ok = check_json_syntax(file_path)
    if not syntax_ok:
        print(f"\n{'='*80}")
        print(f"RESULT: JSON SYNTAX ERROR - FIX BEFORE PROCEEDING")
        print(f"{'='*80}\n")
        sys.exit(1)
    
    # Step 2: Validate recipe structure
    structure_ok = validate_recipe_structure(file_path)
    
    # Step 3: Check for duplicate IDs
    no_duplicates = check_duplicate_ids(file_path)
    
    # Final result
    print(f"\n{'='*80}")
    print(f"FINAL RESULT")
    print(f"{'='*80}\n")
    
    if syntax_ok and structure_ok and no_duplicates:
        print("✅ ALL CHECKS PASSED!")
        print("   Your JSON file is valid and ready for migration.")
        sys.exit(0)
    else:
        print("❌ VALIDATION FAILED")
        if not syntax_ok:
            print("   - Fix JSON syntax errors first")
        if not structure_ok:
            print("   - Fix recipe structure errors")
        if not no_duplicates:
            print("   - Remove duplicate IDs")
        print("\nPlease fix the errors and run this script again.")
        sys.exit(1)


if __name__ == '__main__':
    main()
