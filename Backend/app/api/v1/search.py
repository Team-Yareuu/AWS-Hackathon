"""
AI-powered recipe search endpoint with Neo4j and AWS Bedrock
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from app.db.session import get_driver
import re

router = APIRouter()


class SearchQuery(BaseModel):
    query: str
    budget: Optional[int] = None
    max_time: Optional[int] = None  # in minutes
    servings: Optional[int] = None
    dietary: Optional[List[str]] = None
    difficulty: Optional[str] = None
    sort_by: Optional[str] = "relevance"


class SearchResult(BaseModel):
    recipe: dict
    score: float
    match_reasons: List[str]


@router.post("/", response_model=List[dict])
async def ai_search_recipes(search_query: SearchQuery):
    """
    AI-powered recipe search with multi-criteria matching
    
    Query examples:
    - "resep ayam untuk 4 orang budget 50rb"
    - "masakan cepat 30 menit tanpa santan"
    - "rendang tradisional pedas"
    """
    
    try:
        # Step 1: Parse query with AI (Bedrock)
        parsed_query = await parse_search_intent(search_query.query)
        
        # Step 2: Build Cypher query based on parsed intent
        cypher_query, params = build_smart_cypher_query(
            parsed_query=parsed_query,
            budget=search_query.budget,
            max_time=search_query.max_time,
            servings=search_query.servings,
            dietary=search_query.dietary,
            difficulty=search_query.difficulty
        )
        
        # Step 3: Execute search in Neo4j
        driver = get_driver()
        async with driver.session() as session:
            # Dynamic query construction is safe here as we control the query builder
            result = await session.run(cypher_query, **params)  # type: ignore
            recipes = await result.data()
        
        # Step 4: Score and rank results
        scored_results = score_search_results(
            recipes=recipes,
            parsed_query=parsed_query,
            original_query=search_query.query
        )
        
        # Step 5: Apply sorting
        sorted_results = apply_sorting(
            scored_results,
            sort_by=search_query.sort_by or 'relevance'
        )
        
        return sorted_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


async def parse_search_intent(query: str) -> dict:
    """
    Use AWS Bedrock to understand search intent
    
    Returns:
        {
            'ingredients': ['ayam', 'tomat'],
            'cuisine': 'padang',
            'constraints': {
                'budget': 50000,
                'time': 30,
                'servings': 4
            },
            'preferences': {
                'spice_level': 'pedas',
                'difficulty': 'mudah'
            },
            'avoid': ['santan', 'seafood'],
            'intent': 'quick_dinner'
        }
    """
    
    try:
        # TODO: Query Bedrock when service is ready
        # Prompt for Bedrock would be:
        # f"""Analisis query pencarian resep: "{query}"
        # Extract: ingredients, cuisine, constraints, preferences, avoid, keywords, intent"""
        # bedrock_response = await query_bedrock_agent(prompt)
        # parsed = json.loads(bedrock_response)
        # return parsed
        
        # For now, use fallback parser
        return fallback_query_parser(query)
        
    except Exception:
        # Fallback to basic parsing if Bedrock fails
        return fallback_query_parser(query)


def fallback_query_parser(query: str) -> dict:
    """
    Simple regex-based parser as fallback
    """
    normalized = query.lower()
    
    # Extract budget
    budget_match = re.search(r'(\d+)\s*(rb|ribu|k|000)', normalized)
    budget = None
    if budget_match:
        num = int(budget_match.group(1))
        budget = num * 1000 if budget_match.group(2) in ['rb', 'ribu', 'k'] else num
    
    # Extract time
    time_match = re.search(r'(\d+)\s*(menit|jam)', normalized)
    time = None
    if time_match:
        num = int(time_match.group(1))
        time = num * 60 if time_match.group(2) == 'jam' else num
    
    # Extract servings
    servings_match = re.search(r'(\d+)\s*(orang|porsi)', normalized)
    servings = int(servings_match.group(1)) if servings_match else None
    
    # Detect ingredients (common ones)
    common_ingredients = ['ayam', 'ikan', 'udang', 'daging', 'sapi', 'kambing', 
                         'tempe', 'tahu', 'telur', 'nasi', 'mie']
    ingredients = [ing for ing in common_ingredients if ing in normalized]
    
    # Detect cuisine
    cuisines = ['padang', 'jawa', 'sunda', 'betawi', 'minang', 'manado', 
               'bali', 'yogya', 'solo']
    cuisine = next((c for c in cuisines if c in normalized), None)
    
    # Detect dietary preferences
    dietary = []
    if 'vegetarian' in normalized or 'nabati' in normalized:
        dietary.append('vegetarian')
    if 'halal' in normalized:
        dietary.append('halal')
    
    # Detect avoidance
    avoid = []
    if 'tanpa santan' in normalized or 'no santan' in normalized:
        avoid.append('santan')
    if 'tanpa seafood' in normalized:
        avoid.extend(['ikan', 'udang', 'cumi'])
    
    return {
        'ingredients': ingredients,
        'cuisine': cuisine,
        'constraints': {
            'budget': budget,
            'time': time,
            'servings': servings
        },
        'preferences': {
            'spice_level': 'pedas' if 'pedas' in normalized else None,
            'difficulty': 'mudah' if 'mudah' in normalized or 'cepat' in normalized else None,
            'dietary': dietary
        },
        'avoid': avoid,
        'keywords': normalized.split(),
        'intent': detect_meal_intent(normalized)
    }


def detect_meal_intent(query: str) -> Optional[str]:
    """Detect meal type from query"""
    if any(word in query for word in ['sarapan', 'pagi', 'breakfast']):
        return 'breakfast'
    if any(word in query for word in ['makan siang', 'lunch']):
        return 'lunch'
    if any(word in query for word in ['makan malam', 'dinner']):
        return 'dinner'
    if any(word in query for word in ['cemilan', 'snack']):
        return 'snack'
    if any(word in query for word in ['dessert', 'penutup', 'manis']):
        return 'dessert'
    return None


def build_smart_cypher_query(
    parsed_query: dict,
    budget: Optional[int],
    max_time: Optional[int],
    servings: Optional[int],
    dietary: Optional[List[str]],
    difficulty: Optional[str]
) -> tuple[str, dict]:
    """
    Build dynamic Cypher query based on parsed intent
    Fetches ALL data including ingredients for comprehensive matching
    """
    
    # Enhanced query to get recipe with ingredients
    cypher = """
    MATCH (r:Recipe)
    OPTIONAL MATCH (r)-[rel:HAS_INGREDIENT]->(i:Ingredient)
    WHERE 1=1
    """
    
    params = {}
    
    # Budget constraint
    effective_budget = budget or parsed_query.get('constraints', {}).get('budget')
    if effective_budget:
        cypher += " AND r.estimatedCost <= $budget"
        params['budget'] = effective_budget
    
    # Time constraint
    effective_time = max_time or parsed_query.get('constraints', {}).get('time')
    if effective_time:
        cypher += " AND r.cookingTimeMinutes <= $max_time"
        params['max_time'] = effective_time
    
    # Difficulty
    if difficulty:
        cypher += " AND r.difficulty = $difficulty"
        params['difficulty'] = difficulty
    
    # Return full recipe data with ingredients
    cypher += """
    WITH r, 
         collect(DISTINCT {
             name: i.name, 
             category: i.category,
             quantity: rel.quantityValue,
             unit: rel.quantityUnit
         }) as ingredients
    RETURN r {
        .*,
        id: r.id,
        name: r.name,
        description: r.description,
        shortDescription: r.shortDescription,
        fullStory: r.fullStory,
        shortStory: r.shortStory,
        image: r.image,
        region: r.region,
        cultural: r.region,
        difficulty: r.difficulty,
        estimatedCost: r.estimatedCost,
        cookingTimeMinutes: r.cookingTimeMinutes,
        servings: r.servings,
        isTraditional: r.isTraditional,
        isNew: r.isNew,
        ingredients: ingredients
    } as recipe
    LIMIT 100
    """
    
    return cypher, params


def score_search_results(
    recipes: List[dict],
    parsed_query: dict,
    original_query: str
) -> List[dict]:
    """
    Enhanced scoring with NLP and comprehensive property matching
    Uses ALL available data for intelligent ranking
    """
    
    normalized_query = original_query.lower()
    query_tokens = set(normalized_query.split())
    
    # Extract parsed data
    ingredients = parsed_query.get('ingredients', [])
    cuisine = parsed_query.get('cuisine', '')
    avoid_ingredients = parsed_query.get('avoid', [])
    
    # Scoring weights (fine-tuned for better relevance)
    WEIGHTS = {
        'exact_name_match': 50,          # Highest priority
        'exact_ingredient_match': 40,    # Very important for ingredient queries
        'name_keyword': 30,              # High priority for name matches
        'ingredient_keyword': 25,        # Important for ingredient-based search
        'description_keyword': 15,       # Medium priority
        'cultural_match': 20,            # Good for regional queries
        'story_match': 10,               # Additional context
        'region_match': 18,              # Regional relevance
        'budget_fit': 12,                # Budget constraint bonus
        'time_fit': 10,                  # Time constraint bonus
        'difficulty_match': 8,           # Difficulty preference
        'traditional_bonus': 5,          # Traditional recipe bonus
        'avoid_penalty': -50,            # Strong penalty for avoided ingredients
        'partial_match': 5               # Partial word matches
    }
    
    scored_results = []
    
    for item in recipes:
        recipe = item.get('recipe', {})
        score = 0.0
        match_reasons = []
        
        # Extract all text fields for comprehensive matching
        name = recipe.get('name', '').lower()
        description = recipe.get('description', '').lower()
        short_desc = recipe.get('shortDescription', '').lower()
        cultural = recipe.get('cultural', '').lower()
        region = recipe.get('region', '').lower()
        short_story = recipe.get('shortStory', '').lower()
        full_story = recipe.get('fullStory', '').lower()
        
        # Get ingredients from recipe
        recipe_ingredients = recipe.get('ingredients', [])
        recipe_ingredient_names = [
            ing.get('name', '').lower() 
            for ing in recipe_ingredients 
            if ing.get('name')
        ]
        recipe_ingredient_text = ' '.join(recipe_ingredient_names)
        
        # 1. EXACT MATCHES (Highest Priority)
        if normalized_query == name:
            score += WEIGHTS['exact_name_match']
            match_reasons.append(f"🎯 Exact match: {recipe.get('name')}")
        
        # 2. INGREDIENT MATCHING (Critical for "ayam", "ikan", etc queries)
        for query_token in query_tokens:
            if len(query_token) > 2:  # Skip very short words
                # Check if query token is an ingredient
                for recipe_ing_name in recipe_ingredient_names:
                    if query_token in recipe_ing_name or recipe_ing_name in query_token:
                        score += WEIGHTS['exact_ingredient_match']
                        match_reasons.append(f"🥘 Has ingredient: {recipe_ing_name}")
                        break
                
                # Also check if ingredient appears in recipe text
                if query_token in recipe_ingredient_text:
                    score += WEIGHTS['ingredient_keyword']
                    match_reasons.append(f"📝 Ingredient mentioned: {query_token}")
        
        # 3. NAME MATCHING (Very Important)
        for keyword in query_tokens:
            if len(keyword) > 2:
                if keyword in name:
                    score += WEIGHTS['name_keyword']
                    match_reasons.append(f"📌 Name contains: {keyword}")
        
        # 4. DESCRIPTION MATCHING
        all_descriptions = f"{description} {short_desc}"
        for keyword in query_tokens:
            if len(keyword) > 2:
                if keyword in all_descriptions:
                    score += WEIGHTS['description_keyword']
                    match_reasons.append("📄 Description match")
                    break
        
        # 5. CULTURAL/REGIONAL MATCHING
        if cuisine:
            if cuisine in cultural or cuisine in region:
                score += WEIGHTS['cultural_match']
                match_reasons.append(f"🌍 Regional: {region}")
        
        if region and any(word in region for word in query_tokens):
            score += WEIGHTS['region_match']
            match_reasons.append(f"📍 Region match: {region}")
        
        # 6. STORY/CULTURAL CONTEXT
        all_stories = f"{short_story} {full_story}"
        for keyword in query_tokens:
            if len(keyword) > 3 and keyword in all_stories:
                score += WEIGHTS['story_match']
                match_reasons.append("📖 Cultural story match")
                break
        
        # 7. PARSED INGREDIENTS MATCHING
        for parsed_ing in ingredients:
            if parsed_ing in recipe_ingredient_text:
                score += WEIGHTS['exact_ingredient_match']
                match_reasons.append(f"✅ Contains: {parsed_ing}")
            elif parsed_ing in name or parsed_ing in description:
                score += WEIGHTS['name_keyword']
                match_reasons.append(f"✅ Mentioned: {parsed_ing}")
        
        # 8. AVOID INGREDIENTS (Penalty)
        for avoid_ing in avoid_ingredients:
            if avoid_ing in recipe_ingredient_text:
                score += WEIGHTS['avoid_penalty']
                match_reasons.append(f"❌ Contains avoided: {avoid_ing}")
        
        # 9. CONSTRAINT MATCHING
        budget = parsed_query.get('constraints', {}).get('budget')
        if budget:
            cost = recipe.get('estimatedCost', 0)
            if cost <= budget:
                score += WEIGHTS['budget_fit']
                match_reasons.append(f"💰 Budget OK: Rp {cost:,}")
            else:
                score -= 5  # Small penalty for over budget
        
        time_limit = parsed_query.get('constraints', {}).get('time')
        if time_limit:
            cook_time = recipe.get('cookingTimeMinutes', 999)
            if cook_time <= time_limit:
                score += WEIGHTS['time_fit']
                match_reasons.append(f"⏱️ Quick: {cook_time} min")
        
        # 10. DIFFICULTY MATCHING
        pref_difficulty = parsed_query.get('preferences', {}).get('difficulty')
        if pref_difficulty and recipe.get('difficulty', '').lower() == pref_difficulty:
            score += WEIGHTS['difficulty_match']
            match_reasons.append("🎓 Difficulty match")
        
        # 11. TRADITIONAL BONUS
        if recipe.get('isTraditional') and any(word in normalized_query for word in ['tradisional', 'asli', 'autentik', 'khas']):
            score += WEIGHTS['traditional_bonus']
            match_reasons.append("🏛️ Traditional recipe")
        
        # 12. PARTIAL WORD MATCHING (Fuzzy matching)
        for keyword in query_tokens:
            if len(keyword) > 3:
                # Check if keyword is substring of recipe name words
                name_words = name.split()
                for name_word in name_words:
                    if len(name_word) > 3 and (keyword in name_word or name_word in keyword):
                        score += WEIGHTS['partial_match']
                        match_reasons.append(f"🔍 Partial: {name_word}")
                        break
        
        # 13. BONUS FOR MULTIPLE MATCHES
        if len(match_reasons) > 3:
            score += len(match_reasons) * 2  # Bonus for comprehensive matches
            match_reasons.append(f"⭐ Multiple matches ({len(match_reasons)})")
        
        # Add to results if score > 0
        if score > 0:
            scored_results.append({
                'recipe': recipe,
                'score': round(score, 2),
                'match_reasons': match_reasons
            })
    
    return scored_results


def apply_sorting(results: List[dict], sort_by: str) -> List[dict]:
    """
    Sort results based on criteria
    """
    
    if sort_by == 'relevance':
        results.sort(key=lambda x: x['score'], reverse=True)
    elif sort_by == 'rating':
        results.sort(key=lambda x: x['recipe'].get('rating', 0), reverse=True)
    elif sort_by == 'budget':
        results.sort(key=lambda x: x['recipe'].get('estimatedCost', 999999))
    elif sort_by == 'time':
        results.sort(key=lambda x: x['recipe'].get('cookingTimeMinutes', 999999))
    elif sort_by == 'recent':
        results.sort(key=lambda x: x['recipe'].get('id', 0), reverse=True)
    
    # Return only recipes (remove scoring metadata for client)
    return [item['recipe'] for item in results]
