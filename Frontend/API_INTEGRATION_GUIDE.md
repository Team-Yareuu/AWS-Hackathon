# API Integration Guide

This guide shows where the real backend API is consumed in the frontend application.

## ✅ Already Integrated

### 1. Recipe Detail Page (`/recipe-detail/:id`)
**File:** `Frontend/src/pages/recipe-detail/index.jsx`

**What it does:**
- Fetches recipe data from the backend API using `recipeAPI.getById(id)`
- Shows loading state while fetching
- Falls back to mock data if API fails
- Displays real recipe data from Neo4j database

**How to test:**
1. Go to: `http://localhost:4028/recipe-detail/1`
2. You should see "Memuat resep dari database..." (loading)
3. Then the Rendang recipe from your database will display
4. Open browser console (F12) to see API calls:
   - `🔍 Fetching recipe from API: 1`
   - `✅ Recipe fetched: {recipe data}`

---

## 🔄 Pages That Need Integration

### 2. Homepage - Featured Recipes
**File:** `Frontend/src/pages/homepage/components/FeaturedRecipes.jsx`

**What needs to change:**
```javascript
// Current: Uses mock data
import mockRecipes from '../../../data/mockRecipe.json';

// Update to:
import { recipeAPI } from '../../../services/api';

const [recipes, setRecipes] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchRecipes = async () => {
    try {
      const data = await recipeAPI.getAll(0, 6); // Get first 6 recipes
      setRecipes(data);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchRecipes();
}, []);
```

---

### 3. AI Recipe Search
**File:** `Frontend/src/pages/ai-recipe-search/components/SearchInterface.jsx`

**What needs to change:**
```javascript
import { aiAPI } from '../../../services/api';

const handleSearch = async () => {
  try {
    setLoading(true);
    const results = await aiAPI.search(searchQuery);
    setSearchResults(results);
  } catch (error) {
    console.error('AI search failed:', error);
    // Note: AI endpoint requires AWS Bedrock credentials
  } finally {
    setLoading(false);
  }
};
```

---

### 4. Personal Kitchen Dashboard
**File:** `Frontend/src/pages/personal-kitchen-dashboard/components/SavedRecipesSection.jsx`

**What needs to change:**
```javascript
import { userAPI } from '../../../services/api';

useEffect(() => {
  const fetchSavedRecipes = async () => {
    try {
      const data = await userAPI.getSavedRecipes();
      setSavedRecipes(data);
    } catch (error) {
      console.error('Failed to fetch saved recipes:', error);
    }
  };
  fetchSavedRecipes();
}, []);
```

---

## 📋 Available API Methods

All APIs are available in: `Frontend/src/services/api.js`

### Recipe API
```javascript
import { recipeAPI } from './services/api';

// Get all recipes with pagination
const recipes = await recipeAPI.getAll(skip, limit);

// Get single recipe by ID
const recipe = await recipeAPI.getById('1');

// Create new recipe
const newRecipe = await recipeAPI.create(recipeData);
```

### AI API (Requires AWS Bedrock)
```javascript
import { aiAPI } from './services/api';

// Search recipes using AI
const results = await aiAPI.search('rendang budget 50rb');

// Get AI assistant response
const response = await aiAPI.assistant(question, context);
```

### User API
```javascript
import { userAPI } from './services/api';

// Register user
const user = await userAPI.register({ email, password });

// Login
const token = await userAPI.login(email, password);

// Save recipe
await userAPI.saveRecipe(recipeId);

// Get saved recipes
const savedRecipes = await userAPI.getSavedRecipes();
```

---

## 🧪 How to Test

### Test Current Integration:

1. **Open Recipe Detail Page:**
   ```
   http://localhost:4028/recipe-detail/1
   ```

2. **Check Browser Console (F12):**
   - Look for: `🔍 Fetching recipe from API: 1`
   - Look for: `✅ Recipe fetched:` followed by recipe data

3. **Check Network Tab:**
   - You should see a request to: `http://localhost:8000/api/v1/recipes/1`
   - Status should be: `200 OK`
   - Response should contain the Rendang recipe data

---

## 📊 Backend API Endpoints

All endpoints are available at: `http://localhost:8000`

### Recipes
- `GET /api/v1/recipes/` - Get all recipes
- `GET /api/v1/recipes/{id}` - Get recipe by ID
- `POST /api/v1/recipes/` - Create recipe

### AI (Requires AWS Credentials)
- `POST /api/v1/ai/search?query={query}` - AI recipe search
- `POST /api/v1/ai/assistant` - AI assistant

### Users
- `POST /api/v1/users/register` - Register user
- `POST /api/v1/users/token` - Login
- `POST /api/v1/users/me/saved-recipes` - Save recipe
- `GET /api/v1/users/me/saved-recipes` - Get saved recipes

---

## 🔍 Debugging Tips

1. **Check if backend is running:**
   ```
   curl http://localhost:8000/
   ```
   Should return: `{"status":"ok","message":"Welcome to the Culinary AI Backend!"}`

2. **Check if frontend can connect:**
   - Open: `http://localhost:4028/api-test`
   - Should show green "Connected" status

3. **View API calls in console:**
   - Open browser console (F12)
   - Look for console.log messages with emojis (🔍, ✅, ❌)

4. **Check Network tab:**
   - Open Dev Tools > Network tab
   - Filter by: XHR or Fetch
   - You should see API requests to `localhost:8000`

---

## ✨ Next Steps

1. ✅ **Recipe Detail Page** - Already using real API
2. 🔄 **Update Homepage** - Fetch real recipes for featured section
3. 🔄 **Update AI Search** - Connect to AI search endpoint (needs AWS)
4. 🔄 **Update Dashboard** - Fetch saved recipes from user API
5. 🔄 **Add Loading States** - Show spinners while fetching data
6. 🔄 **Error Handling** - Show user-friendly error messages

---

## 🎯 Summary

- **Test Page:** `http://localhost:4028/api-test` - For testing all APIs
- **Real Page:** `http://localhost:4028/recipe-detail/1` - Now uses real API ✅
- **API Service:** `Frontend/src/services/api.js` - Centralized API calls
- **Backend:** `http://localhost:8000` - Must be running
- **Database:** Neo4j with 1 recipe loaded (Rendang)

