"""
Unit tests for recipe validator
"""
import unittest
import json
import tempfile
import os
from app.utils.recipe_validator import (
    check_ingredients_structure,
    check_ingredient_items,
    validate_recipe_file
)


class TestRecipeValidator(unittest.TestCase):
    """Test cases for recipe validator"""
    
    def test_valid_recipe_structure(self):
        """Test recipe with valid structure"""
        recipe = {
            "id": "1",
            "name": "Test Recipe",
            "ingredients": [
                {
                    "bahan_utama": [
                        {
                            "name": "Test Ingredient",
                            "quantity": {"value": 100, "unit": "gram"}
                        }
                    ],
                    "bumbu": [
                        {
                            "name": "Test Spice",
                            "quantity": {"value": 1, "unit": "sdm"}
                        }
                    ]
                }
            ]
        }
        
        is_valid, errors = check_ingredients_structure(recipe)
        self.assertTrue(is_valid)
        self.assertEqual(len(errors), 0)
    
    def test_invalid_category_bumbu_halus(self):
        """Test recipe with bumbu_halus (should be invalid)"""
        recipe = {
            "id": "2",
            "name": "Invalid Recipe",
            "ingredients": [
                {
                    "bahan_utama": [],
                    "bumbu_halus": [
                        {
                            "name": "Bawang",
                            "quantity": {"value": 5, "unit": "siung"}
                        }
                    ]
                }
            ]
        }
        
        is_valid, errors = check_ingredients_structure(recipe)
        self.assertFalse(is_valid)
        self.assertTrue(any("bumbu_halus" in err for err in errors))
    
    def test_invalid_category_pelengkap(self):
        """Test recipe with pelengkap (should be invalid)"""
        recipe = {
            "id": "3",
            "name": "Invalid Recipe",
            "ingredients": [
                {
                    "bahan_utama": [],
                    "bumbu": [],
                    "pelengkap": [
                        {
                            "name": "Bawang Goreng",
                            "quantity": {"value": None, "unit": "secukupnya"}
                        }
                    ]
                }
            ]
        }
        
        is_valid, errors = check_ingredients_structure(recipe)
        self.assertFalse(is_valid)
        self.assertTrue(any("pelengkap" in err for err in errors))
    
    def test_missing_required_category(self):
        """Test recipe missing required category"""
        recipe = {
            "id": "4",
            "name": "Incomplete Recipe",
            "ingredients": [
                {
                    "bahan_utama": [
                        {
                            "name": "Test",
                            "quantity": {"value": 1, "unit": "buah"}
                        }
                    ]
                    # Missing 'bumbu' category
                }
            ]
        }
        
        is_valid, errors = check_ingredients_structure(recipe)
        self.assertFalse(is_valid)
        self.assertTrue(any("Missing required categories" in err for err in errors))
    
    def test_missing_ingredient_name(self):
        """Test ingredient item missing name field"""
        recipe = {
            "id": "5",
            "name": "Test Recipe",
            "ingredients": [
                {
                    "bahan_utama": [
                        {
                            # Missing 'name'
                            "quantity": {"value": 100, "unit": "gram"}
                        }
                    ],
                    "bumbu": []
                }
            ]
        }
        
        is_valid, errors = check_ingredient_items(recipe)
        self.assertFalse(is_valid)
        self.assertTrue(any("missing fields: name" in err for err in errors))
    
    def test_missing_quantity_unit(self):
        """Test ingredient item missing quantity unit"""
        recipe = {
            "id": "6",
            "name": "Test Recipe",
            "ingredients": [
                {
                    "bahan_utama": [
                        {
                            "name": "Test Ingredient",
                            "quantity": {"value": 100}  # Missing 'unit'
                        }
                    ],
                    "bumbu": []
                }
            ]
        }
        
        is_valid, errors = check_ingredient_items(recipe)
        self.assertFalse(is_valid)
        self.assertTrue(any("missing 'unit' field" in err for err in errors))
    
    def test_validate_file_with_valid_recipes(self):
        """Test file validation with valid recipes"""
        recipes = [
            {
                "id": "1",
                "name": "Recipe 1",
                "ingredients": [
                    {
                        "bahan_utama": [{"name": "A", "quantity": {"value": 1, "unit": "kg"}}],
                        "bumbu": [{"name": "B", "quantity": {"value": 1, "unit": "sdm"}}]
                    }
                ]
            },
            {
                "id": "2",
                "name": "Recipe 2",
                "ingredients": [
                    {
                        "bahan_utama": [{"name": "C", "quantity": {"value": 2, "unit": "buah"}}],
                        "bumbu": [{"name": "D", "quantity": {"value": 1, "unit": "sdt"}}]
                    }
                ]
            }
        ]
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(recipes, f)
            temp_file = f.name
        
        try:
            results = validate_recipe_file(temp_file)
            self.assertEqual(results['total_recipes'], 2)
            self.assertEqual(results['valid_recipes'], 2)
            self.assertEqual(results['invalid_recipes'], 0)
        finally:
            os.unlink(temp_file)
    
    def test_validate_file_with_invalid_recipes(self):
        """Test file validation with invalid recipes"""
        recipes = [
            {
                "id": "1",
                "name": "Valid Recipe",
                "ingredients": [
                    {
                        "bahan_utama": [{"name": "A", "quantity": {"value": 1, "unit": "kg"}}],
                        "bumbu": [{"name": "B", "quantity": {"value": 1, "unit": "sdm"}}]
                    }
                ]
            },
            {
                "id": "2",
                "name": "Invalid Recipe",
                "ingredients": [
                    {
                        "bahan_utama": [],
                        "bumbu_halus": [{"name": "C", "quantity": {"value": 1, "unit": "sdm"}}]
                    }
                ]
            }
        ]
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(recipes, f)
            temp_file = f.name
        
        try:
            results = validate_recipe_file(temp_file)
            self.assertEqual(results['total_recipes'], 2)
            self.assertEqual(results['valid_recipes'], 1)
            self.assertEqual(results['invalid_recipes'], 1)
            self.assertTrue(len(results['errors']) > 0)
        finally:
            os.unlink(temp_file)
    
    def test_empty_ingredients_list(self):
        """Test recipe with empty ingredients list"""
        recipe = {
            "id": "7",
            "name": "Empty Recipe",
            "ingredients": []
        }
        
        is_valid, errors = check_ingredients_structure(recipe)
        self.assertFalse(is_valid)
        self.assertTrue(any("must be a non-empty list" in err for err in errors))
    
    def test_null_quantity_value(self):
        """Test ingredient with null quantity value (should be valid for 'secukupnya')"""
        recipe = {
            "id": "8",
            "name": "Test Recipe",
            "ingredients": [
                {
                    "bahan_utama": [
                        {
                            "name": "Bawang Goreng",
                            "quantity": {"value": None, "unit": "secukupnya"}
                        }
                    ],
                    "bumbu": [
                        {
                            "name": "Garam",
                            "quantity": {"value": 1, "unit": "sdt"}
                        }
                    ]
                }
            ]
        }
        
        is_valid_structure, _ = check_ingredients_structure(recipe)
        is_valid_items, _ = check_ingredient_items(recipe)
        
        self.assertTrue(is_valid_structure)
        self.assertTrue(is_valid_items)


if __name__ == '__main__':
    unittest.main()
