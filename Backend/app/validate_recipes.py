"""
Recipe Data Validator
Validates recipe JSON data against the schema before migration to Neo4j.
"""
import json
import sys
from pathlib import Path
from typing import List, Dict, Any, Tuple
try:
    from jsonschema import Draft7Validator
    from jsonschema.exceptions import SchemaError
except ImportError:
    print("⚠️  jsonschema not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "jsonschema"])
    from jsonschema import Draft7Validator
    from jsonschema.exceptions import SchemaError


class RecipeValidator:
    """Validator for recipe JSON data"""
    
    def __init__(self, schema_path: Path, data_path: Path):
        self.schema_path = schema_path
        self.data_path = data_path
        self.schema = None
        self.data = None
        self.errors = []
        self.warnings = []
        
    def load_schema(self) -> bool:
        """Load JSON schema from file"""
        try:
            with open(self.schema_path, 'r', encoding='utf-8') as f:
                self.schema = json.load(f)
            print(f"✅ Schema loaded from {self.schema_path}")
            return True
        except FileNotFoundError:
            print(f"❌ Schema file not found: {self.schema_path}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in schema file: {e}")
            return False
    
    def load_data(self) -> bool:
        """Load recipe data from file"""
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            print(f"✅ Data loaded from {self.data_path}")
            print(f"📊 Total recipes: {len(self.data)}")
            return True
        except FileNotFoundError:
            print(f"❌ Data file not found: {self.data_path}")
            return False
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON in data file: {e}")
            return False
    
    def validate_schema_itself(self) -> bool:
        """Validate that the schema itself is valid"""
        if self.schema is None:
            print("❌ Schema not loaded")
            return False
        try:
            Draft7Validator.check_schema(self.schema)
            print("✅ Schema structure is valid")
            return True
        except SchemaError as e:
            print(f"❌ Invalid schema structure: {e}")
            return False
    
    def validate_recipes(self) -> Tuple[bool, List[Dict[str, Any]]]:
        """Validate all recipes against schema"""
        if self.schema is None:
            print("❌ Schema not loaded")
            return False, []
        if self.data is None:
            print("❌ Data not loaded")
            return False, []
        
        validator = Draft7Validator(self.schema)
        all_valid = True
        validation_results = []
        
        print("\n" + "="*80)
        print("VALIDATING RECIPES")
        print("="*80 + "\n")
        
        for idx, recipe in enumerate(self.data, 1):
            recipe_id = recipe.get('id', f'index-{idx}')
            recipe_name = recipe.get('name', 'Unknown')
            
            errors = list(validator.iter_errors(recipe))
            
            if errors:
                all_valid = False
                print(f"❌ Recipe {idx} (ID: {recipe_id}): {recipe_name}")
                for error in errors:
                    path = " -> ".join(str(p) for p in error.path) if error.path else "root"
                    print(f"   ⚠️  {path}: {error.message}")
                    validation_results.append({
                        'recipe_id': recipe_id,
                        'recipe_name': recipe_name,
                        'path': path,
                        'error': error.message,
                        'status': 'error'
                    })
                print()
            else:
                print(f"✅ Recipe {idx} (ID: {recipe_id}): {recipe_name}")
                validation_results.append({
                    'recipe_id': recipe_id,
                    'recipe_name': recipe_name,
                    'status': 'valid'
                })
        
        return all_valid, validation_results
    
    def check_data_quality(self) -> List[Dict[str, Any]]:
        """Additional data quality checks beyond schema validation"""
        if self.data is None:
            print("❌ Data not loaded")
            return []
        
        quality_issues = []
        
        print("\n" + "="*80)
        print("DATA QUALITY CHECKS")
        print("="*80 + "\n")
        
        for idx, recipe in enumerate(self.data, 1):
            recipe_id = recipe.get('id', f'index-{idx}')
            recipe_name = recipe.get('name', 'Unknown')
            
            # Check for duplicate IDs
            ids = [r.get('id') for r in self.data]
            if ids.count(recipe_id) > 1:
                issue = {
                    'recipe_id': recipe_id,
                    'recipe_name': recipe_name,
                    'type': 'duplicate_id',
                    'message': f'Duplicate ID found: {recipe_id}'
                }
                quality_issues.append(issue)
                print(f"⚠️  {recipe_name}: Duplicate ID {recipe_id}")
            
            # Check if cooking steps are in order
            steps = recipe.get('cookingSteps', [])
            expected_step = 1
            for step in steps:
                if step.get('step') != expected_step:
                    issue = {
                        'recipe_id': recipe_id,
                        'recipe_name': recipe_name,
                        'type': 'step_order',
                        'message': f'Step order mismatch: expected {expected_step}, got {step.get("step")}'
                    }
                    quality_issues.append(issue)
                    print(f"⚠️  {recipe_name}: Step order issue at step {expected_step}")
                    break
                expected_step += 1
            
            # Check if estimated cost matches budget data
            if 'budgetData' in recipe and 'offlineStores' in recipe['budgetData']:
                for store in recipe['budgetData']['offlineStores']:
                    total_ingredients = sum(
                        item.get('estimatedPrice', 0) 
                        for item in store.get('rincianBahan', [])
                    )
                    estimated_cost = recipe.get('estimatedCost', 0)
                    
                    # Allow 20% variance
                    if abs(total_ingredients - estimated_cost) > estimated_cost * 0.2:
                        issue = {
                            'recipe_id': recipe_id,
                            'recipe_name': recipe_name,
                            'type': 'cost_mismatch',
                            'message': f'Cost mismatch: recipe says {estimated_cost}, store total is {total_ingredients}'
                        }
                        quality_issues.append(issue)
                        print(f"⚠️  {recipe_name}: Cost mismatch (recipe: {estimated_cost}, store: {total_ingredients})")
            
            # Check for missing cultural story
            if not recipe.get('culturalStory'):
                issue = {
                    'recipe_id': recipe_id,
                    'recipe_name': recipe_name,
                    'type': 'missing_cultural_story',
                    'message': 'Missing cultural story'
                }
                quality_issues.append(issue)
                print(f"ℹ️  {recipe_name}: Missing cultural story (optional)")
            
            # Check for empty ingredient substitutes
            ingredients = recipe.get('ingredients', [])
            for ing_group in ingredients:
                for category, items in ing_group.items():
                    for item in items:
                        if 'substitutes' in item and not item['substitutes']:
                            issue = {
                                'recipe_id': recipe_id,
                                'recipe_name': recipe_name,
                                'type': 'empty_substitutes',
                                'message': f'Empty substitutes array for ingredient: {item.get("name")}'
                            }
                            quality_issues.append(issue)
        
        if not quality_issues:
            print("✅ No data quality issues found!")
        
        return quality_issues
    
    def generate_report(self, validation_results: List[Dict], quality_issues: List[Dict]):
        """Generate validation report"""
        if self.data is None:
            print("❌ Data not loaded")
            return False
        
        print("\n" + "="*80)
        print("VALIDATION REPORT")
        print("="*80 + "\n")
        
        total_recipes = len(self.data)
        valid_recipes = len([r for r in validation_results if r.get('status') == 'valid'])
        invalid_recipes = total_recipes - valid_recipes
        
        print(f"📊 Total Recipes: {total_recipes}")
        print(f"✅ Valid Recipes: {valid_recipes}")
        print(f"❌ Invalid Recipes: {invalid_recipes}")
        print(f"⚠️  Quality Issues: {len(quality_issues)}")
        
        if invalid_recipes == 0:
            print("\n🎉 All recipes are valid and ready for migration!")
        else:
            print(f"\n⚠️  {invalid_recipes} recipe(s) have validation errors that must be fixed.")
        
        # Save detailed report to file
        report_path = self.data_path.parent / "validation_report.json"
        report = {
            'timestamp': __import__('datetime').datetime.now().isoformat(),
            'total_recipes': total_recipes,
            'valid_recipes': valid_recipes,
            'invalid_recipes': invalid_recipes,
            'validation_results': validation_results,
            'quality_issues': quality_issues
        }
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Detailed report saved to: {report_path}")
        
        return invalid_recipes == 0
    
    def run(self) -> bool:
        """Run complete validation process"""
        print("\n" + "="*80)
        print("RECIPE DATA VALIDATION")
        print("="*80 + "\n")
        
        # Load schema
        if not self.load_schema():
            return False
        
        # Validate schema structure
        if not self.validate_schema_itself():
            return False
        
        # Load data
        if not self.load_data():
            return False
        
        # Validate recipes
        all_valid, validation_results = self.validate_recipes()
        
        # Check data quality
        quality_issues = self.check_data_quality()
        
        # Generate report
        success = self.generate_report(validation_results, quality_issues)
        
        return success


def main():
    """Main entry point"""
    # Paths
    base_path = Path(__file__).parent
    schema_path = base_path / "data" / "recipe_schema.json"
    data_path = base_path / "data" / "sample_recipes.json"
    
    # Create validator
    validator = RecipeValidator(schema_path, data_path)
    
    # Run validation
    success = validator.run()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
