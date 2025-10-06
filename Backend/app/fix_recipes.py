"""
Fix recipe data structure for recipes 6-11
Converts old format to match the schema
"""
import json
from pathlib import Path

def fix_ingredient_structure(ingredients):
    """Convert item/amount/unit to name/quantity structure"""
    fixed = []
    for group in ingredients:
        fixed_group = {}
        for category, items in group.items():
            fixed_items = []
            for item in items:
                if 'item' in item:
                    # Old format - needs conversion
                    fixed_item = {
                        'name': item['item'],
                        'quantity': {
                            'value': item.get('amount'),
                            'unit': item.get('unit', 'secukupnya')
                        }
                    }
                    if 'notes' in item:
                        fixed_item['notes'] = item['notes']
                    fixed_items.append(fixed_item)
                else:
                    # Already in correct format
                    fixed_items.append(item)
            fixed_group[category] = fixed_items
        fixed.append(fixed_group)
    return fixed

def fix_cultural_story(cultural_story):
    """Add missing province field to regionalVariations"""
    if not cultural_story or 'regionalVariations' not in cultural_story:
        return cultural_story
    
    for variation in cultural_story['regionalVariations']:
        if 'province' not in variation:
            # Infer province from region or use a default
            region = variation.get('region', '')
            if 'Surabaya' in region or 'Malang' in region:
                variation['province'] = 'Jawa Timur'
            elif 'Purwokerto' in region or 'Yogyakarta' in region or 'Solo' in region:
                variation['province'] = 'Jawa Tengah'
            elif 'Padang' in region or 'Bukittinggi' in region:
                variation['province'] = 'Sumatera Barat'
            elif 'Cirebon' in region:
                variation['province'] = 'Jawa Barat'
            elif 'Jakarta' in region:
                variation['province'] = 'DKI Jakarta'
            else:
                variation['province'] = 'Indonesia'
        
        # Also ensure 'difference' field exists
        if 'difference' not in variation and 'description' in variation:
            variation['difference'] = variation['description']
    
    return cultural_story

def fix_budget_data(budget_data, recipe_region):
    """Fix budget data structure"""
    if not budget_data or 'offlineStores' not in budget_data:
        return budget_data
    
    # Region to coordinates mapping
    coordinates = {
        'Surabaya': {'lat': -7.2575, 'lng': 112.7521},
        'Purwokerto': {'lat': -7.4280, 'lng': 109.2350},
        'Padang': {'lat': -0.9471, 'lng': 100.4172},
        'Bukittinggi': {'lat': -0.3059, 'lng': 100.3692},
        'Cirebon': {'lat': -6.7063, 'lng': 108.5571},
        'Solo': {'lat': -7.5755, 'lng': 110.8243},
        'Yogyakarta': {'lat': -7.7956, 'lng': 110.3695}
    }
    
    for store in budget_data['offlineStores']:
        # Fix location if it's a string
        if isinstance(store.get('location'), str):
            location_str = store['location']
            coords = coordinates.get(location_str, {'lat': -6.2088, 'lng': 106.8456})  # Default to Jakarta
            store['location'] = coords
        
        # Add missing required fields with defaults
        if 'address' not in store:
            store['address'] = f"{store.get('name', 'Unknown Store')}, {store.get('location', 'Unknown')}"
        
        if 'openingHours' not in store:
            store['openingHours'] = '06.00 - 18.00'
        
        if 'estimatedDistance' not in store:
            store['estimatedDistance'] = 2.0
        
        if 'rincianBahan' not in store:
            store['rincianBahan'] = []
    
    return budget_data

def main():
    # Load the data
    data_path = Path(__file__).parent / 'data' / 'sample_recipes.json'
    
    with open(data_path, 'r', encoding='utf-8') as f:
        recipes = json.load(f)
    
    print(f"Loaded {len(recipes)} recipes")
    
    # Fix recipes 6-11 (indices 5-10)
    problem_ids = ['6', '7', '8', '9', '10', '11']
    
    for recipe in recipes:
        if recipe['id'] in problem_ids:
            print(f"Fixing recipe {recipe['id']}: {recipe['name']}")
            
            # Fix ingredients structure
            recipe['ingredients'] = fix_ingredient_structure(recipe['ingredients'])
            
            # Fix cultural story
            if 'culturalStory' in recipe:
                recipe['culturalStory'] = fix_cultural_story(recipe['culturalStory'])
            
            # Fix budget data
            if 'budgetData' in recipe:
                recipe['budgetData'] = fix_budget_data(recipe['budgetData'], recipe.get('region'))
    
    # Save the fixed data
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(recipes, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Fixed recipes saved to {data_path}")
    print("\nRun validation again: python migration.py")

if __name__ == '__main__':
    main()
