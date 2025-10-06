"""Quick test for search API"""
import requests

def test_query(query_text):
    print(f"\n{'='*60}")
    print(f"Query: '{query_text}'")
    print('='*60)
    
    response = requests.post(
        'http://localhost:8000/api/v1/search',
        json={'query': query_text, 'sort_by': 'relevance'},
        timeout=10
    )
    
    if response.status_code == 200:
        results = response.json()
        print(f"✅ Found {len(results)} recipes\n")
        
        for i, recipe in enumerate(results[:10], 1):
            print(f"{i}. {recipe['name']}")
            print(f"   Region: {recipe.get('region', 'N/A')}")
            print(f"   Cost: Rp {recipe.get('estimatedCost', 0):,}")
            print(f"   Time: {recipe.get('cookingTimeMinutes', 0)} min")
            
            # Show ingredients if available
            ingredients = recipe.get('ingredients', [])
            if ingredients:
                ing_names = [ing.get('name', '') for ing in ingredients[:5] if ing.get('name')]
                if ing_names:
                    print(f"   Ingredients: {', '.join(ing_names)}...")
            print()
    else:
        print(f"❌ Error {response.status_code}: {response.text}")

if __name__ == "__main__":
    # Test different queries
    test_query("ayam")
    test_query("rendang")
    test_query("ikan")
    test_query("soto")
