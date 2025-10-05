#!/usr/bin/env python3
"""
Standalone recipe validation script.
Can be run independently before migration.

Usage:
    python validate_data.py
    python validate_data.py --data path/to/recipes.json
    python validate_data.py --schema path/to/schema.json --data path/to/recipes.json
"""
import argparse
import sys
from pathlib import Path

# Add parent directory to path to import the validator
sys.path.insert(0, str(Path(__file__).parent))

from validate_recipes import RecipeValidator


def main():
    parser = argparse.ArgumentParser(
        description='Validate recipe JSON data against schema'
    )
    parser.add_argument(
        '--schema',
        type=Path,
        default=Path(__file__).parent / 'data' / 'recipe_schema.json',
        help='Path to JSON schema file (default: data/recipe_schema.json)'
    )
    parser.add_argument(
        '--data',
        type=Path,
        default=Path(__file__).parent / 'data' / 'sample_recipes.json',
        help='Path to recipe data file (default: data/sample_recipes.json)'
    )
    parser.add_argument(
        '--quiet',
        action='store_true',
        help='Only show summary, not individual recipe validation'
    )
    
    args = parser.parse_args()
    
    # Check if files exist
    if not args.schema.exists():
        print(f"❌ Schema file not found: {args.schema}")
        sys.exit(1)
    
    if not args.data.exists():
        print(f"❌ Data file not found: {args.data}")
        sys.exit(1)
    
    # Run validation
    validator = RecipeValidator(args.schema, args.data)
    success = validator.run()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
