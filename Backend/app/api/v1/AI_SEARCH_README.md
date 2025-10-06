# AI Recipe Search Engine - Implementation Guide

## 🎯 Overview

Sistem pencarian resep dengan AI yang mengintegrasikan:
- **Neo4j Graph Database** - Untuk data relasional resep
- **AWS Bedrock** - Untuk natural language understanding
- **Hybrid Scoring** - Kombinasi keyword + semantic search

---

## 📋 Architecture

```
User Query
    ↓
┌─────────────────────────────────────┐
│  1. Query Parsing (AWS Bedrock)     │
│     - Extract ingredients           │
│     - Parse constraints (budget/time)│
│     - Detect intent (breakfast/etc) │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  2. Build Smart Cypher Query        │
│     - Dynamic WHERE clauses         │
│     - Ingredient matching           │
│     - Cultural/cuisine filtering    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  3. Neo4j Search                    │
│     - Execute Cypher query          │
│     - Fetch matching recipes        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  4. Multi-Criteria Scoring          │
│     - Exact name match: 10 pts      │
│     - Keyword in name: 6 pts        │
│     - Ingredient match: 7 pts       │
│     - Budget fit: 4 pts             │
│     - Time fit: 3 pts               │
│     - Rating bonus: 0.5 pts         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  5. Sorting & Ranking               │
│     - Sort by relevance/rating/etc  │
│     - Return top results            │
└─────────────────────────────────────┘
```

---

## 🔧 API Endpoint

### **POST /api/v1/search**

**Request Body:**
```json
{
  "query": "resep ayam untuk 4 orang budget 50rb",
  "budget": 50000,
  "max_time": 60,
  "servings": 4,
  "dietary": ["halal"],
  "difficulty": "easy",
  "sort_by": "relevance"
}
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Ayam Goreng Kremes",
    "description": "...",
    "rating": 4.8,
    "estimatedCost": 45000,
    "cookingTimeMinutes": 45,
    "servings": 4,
    "difficulty": "easy",
    "cultural": "Jawa",
    "image": "...",
    ...
  }
]
```

---

## 🎨 Query Understanding Examples

### **Example 1: Budget Query**
```
Query: "resep murah budget 30rb untuk 4 orang"

Parsed:
{
  "ingredients": [],
  "cuisine": null,
  "constraints": {
    "budget": 30000,
    "servings": 4
  },
  "keywords": ["murah", "budget", "30rb"]
}
```

### **Example 2: Ingredient Query**
```
Query: "masakan ayam tanpa santan pedas"

Parsed:
{
  "ingredients": ["ayam"],
  "avoid": ["santan"],
  "preferences": {
    "spice_level": "pedas"
  },
  "keywords": ["ayam", "pedas"]
}
```

### **Example 3: Time-constrained Query**
```
Query: "resep cepat 30 menit untuk sarapan"

Parsed:
{
  "constraints": {
    "time": 30
  },
  "intent": "breakfast",
  "keywords": ["cepat", "sarapan"]
}
```

### **Example 4: Cultural Query**
```
Query: "rendang padang asli"

Parsed:
{
  "cuisine": "padang",
  "keywords": ["rendang", "padang", "asli"]
}
```

---

## 📊 Scoring System

| Match Type | Points | Example |
|------------|--------|---------|
| Exact name match | 10 | Query: "rendang" → Recipe: "Rendang Daging" |
| Name contains keyword | 6 | Query: "ayam" → Recipe: "Ayam Goreng" |
| Ingredient match | 7 | Query has "ayam" → Recipe uses "ayam" |
| Cultural match | 5 | Query: "padang" → Recipe: cultural="Padang" |
| Description match | 3 | Keyword found in description |
| Budget fit | 4 | Recipe cost ≤ query budget |
| Time fit | 3 | Recipe time ≤ query time limit |
| Rating bonus | 0.5x | Rating 4.5 → +2.25 points |

**Total Score Example:**
```
Query: "ayam goreng budget 50rb"
Recipe: "Ayam Goreng Kremes" (cost: 45k, rating: 4.8)

Score calculation:
- Name contains "ayam": +6
- Name contains "goreng": +6
- Ingredient match "ayam": +7
- Budget fit (45k ≤ 50k): +4
- Rating bonus (4.8 × 0.5): +2.4
= Total: 25.4 points
```

---

## 🔍 Advanced Features

### **1. Synonym Expansion**
```javascript
// Already implemented in frontend
synonymsDictionary = {
  pedas: ['spicy', 'cabai', 'rawit'],
  murah: ['budget', 'hemat', 'ekonomis'],
  cepat: ['kilat', 'praktis', 'quick']
}
```

### **2. Intent Detection**
- **breakfast** → Filter recipes tagged for morning
- **dinner** → Family-sized portions
- **snack** → Small portions, quick prep
- **dessert** → Sweet recipes

### **3. Dietary Filters**
- **vegetarian** → No meat/seafood
- **halal** → Islamic dietary laws
- **keto** → Low carb
- **vegan** → No animal products

### **4. Avoidance Filters**
```
"tanpa santan" → Exclude recipes with coconut milk
"no seafood" → Exclude fish, shrimp, etc.
"gluten free" → Exclude wheat products
```

---

## 🚀 Integration with Frontend

### **Update API Service**
```javascript
// Frontend/src/services/api.js

export const recipeAPI = {
  // ... existing methods
  
  // New AI search method
  aiSearch: async (searchParams) => {
    const response = await axios.post(`${API_BASE_URL}/search`, {
      query: searchParams.query,
      budget: searchParams.budget,
      max_time: searchParams.maxTime,
      servings: searchParams.servings,
      dietary: searchParams.dietary,
      difficulty: searchParams.difficulty,
      sort_by: searchParams.sortBy || 'relevance'
    });
    return response.data;
  }
};
```

### **Update Search Component**
```javascript
// Replace runAISearchAgent with API call
const handleSearch = async (query) => {
  setIsLoading(true);
  
  try {
    const results = await recipeAPI.aiSearch({
      query: query,
      budget: parseBudgetFromQuery(query),
      maxTime: parseTimeFromQuery(query),
      sortBy: sortBy
    });
    
    setSearchResults(results);
    setHasSearched(true);
  } catch (error) {
    console.error('Search failed:', error);
    // Fallback to local search
    setSearchResults(runAISearchAgent(query));
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🧪 Testing

### **Test Queries**
```bash
# Budget constraint
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "resep murah 30rb"}'

# Time constraint
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "masakan cepat 30 menit"}'

# Ingredient-based
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "ayam tanpa santan"}'

# Cultural
curl -X POST http://localhost:8000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "rendang padang asli"}'
```

---

## 💡 Future Enhancements

1. **Vector Search** - Use embeddings for semantic similarity
2. **User Personalization** - Learn from search history
3. **Collaborative Filtering** - "Users who searched X also liked Y"
4. **Image Search** - Upload photo of ingredients
5. **Voice Search** - Speech-to-text integration
6. **Multi-language** - Support English queries
7. **Fuzzy Matching** - Handle typos gracefully
8. **Cache Popular Queries** - Redis for performance

---

## 📝 Notes

- Fallback parser handles cases when Bedrock is unavailable
- All queries limited to 50 results for performance
- Scoring is tunable via weights adjustment
- Frontend keeps local search as fallback
