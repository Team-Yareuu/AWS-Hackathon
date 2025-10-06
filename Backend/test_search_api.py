"""
Test script for AI Search API
"""
import requests

BASE_URL = "http://localhost:8000/api/v1"

def test_search(query, budget=None, max_time=None):
    """Test the search endpoint"""
    print(f"\n{'='*80}")
    print(f"Testing query: '{query}'")
    print(f"Budget: {budget}, Max Time: {max_time}")
    print('='*80)
    
    payload = {
        "query": query,
        "budget": budget,
        "max_time": max_time,
        "sort_by": "relevance"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/search", json=payload, timeout=10)
        
        if response.status_code == 200:
            results = response.json()
            print(f"\n✅ Found {len(results)} recipes:")
            for i, recipe in enumerate(results[:5], 1):  # Show first 5
                print(f"\n{i}. {recipe.get('name')}")
                print(f"   Cost: Rp {recipe.get('estimatedCost'):,}")
                print(f"   Time: {recipe.get('cookingTimeMinutes')} minutes")
                print(f"   Region: {recipe.get('region')}")
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Backend not running! Start it with:")
        print("   cd Backend && uvicorn app.main:app --reload --port 8000")
    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    print("\n" + "="*80)
    print("AI RECIPE SEARCH - TEST SUITE")
    print("="*80)
    
    # Test 1: Simple query
    test_search("rendang")
    
    # Test 2: Budget constraint
    test_search("masakan murah", budget=30000)
    
    # Test 3: Time constraint
    test_search("masakan cepat", max_time=30)
    
    # Test 4: Complex query
    test_search("ayam untuk 4 orang budget 50rb")
    
    print("\n" + "="*80)
    print("TESTS COMPLETED")
    print("="*80 + "\n")
