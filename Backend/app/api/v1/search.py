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


@router.post("/search", response_model=List[dict])
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
            result = await session.run(cypher_query, params)
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
    """
    
    # Base query
    cypher = """
    MATCH (r:Recipe)
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
    
    # Ingredient matching (optional - if ingredients mentioned)
    ingredients = parsed_query.get('ingredients', [])
    if ingredients:
        cypher += """
        AND ANY(ing IN r.mainIngredients WHERE ing IN $ingredients)
        """
        params['ingredients'] = ingredients
    
    # Cuisine/cultural match
    cuisine = parsed_query.get('cuisine')
    if cuisine:
        cypher += " AND toLower(r.cultural) CONTAINS $cuisine"
        params['cuisine'] = cuisine.lower()
    
    # Text search on name and description
    keywords = parsed_query.get('keywords', [])
    if keywords:
        # Build text search for primary keywords
        main_keywords = [k for k in keywords if len(k) > 3][:3]  # Top 3 keywords
        if main_keywords:
            cypher += """
            AND (
                ANY(keyword IN $keywords WHERE toLower(r.name) CONTAINS keyword)
                OR ANY(keyword IN $keywords WHERE toLower(r.description) CONTAINS keyword)
            )
            """
            params['keywords'] = main_keywords
    
    # Return full recipe data
    cypher += """
    RETURN r {
        .*,
        id: r.id,
        name: r.name,
        description: r.description,
        shortDescription: r.shortDescription,
        image: r.image,
        region: r.region,
        cultural: r.region,
        difficulty: r.difficulty,
        estimatedCost: r.estimatedCost,
        cookingTimeMinutes: r.cookingTimeMinutes,
        servings: r.servings,
        isTraditional: r.isTraditional,
        isNew: r.isNew
    } as recipe
    LIMIT 50
    """
    
    return cypher, params


def score_search_results(
    recipes: List[dict],
    parsed_query: dict,
    original_query: str
) -> List[dict]:
    """
    Score recipes based on relevance to search query
    """
    
    normalized_query = original_query.lower()
    ingredients = parsed_query.get('ingredients', [])
    cuisine = parsed_query.get('cuisine', '')
    keywords = parsed_query.get('keywords', [])
    
    scored_results = []
    
    for item in recipes:
        recipe = item.get('recipe', {})
        score = 0.0
        match_reasons = []
        
        name = recipe.get('name', '').lower()
        description = recipe.get('description', '').lower()
        cultural = recipe.get('cultural', '').lower()
        
        # Exact name match
        if normalized_query in name:
            score += 10
            match_reasons.append("Exact name match")
        
        # Name contains keywords
        for keyword in keywords:
            if keyword in name and len(keyword) > 3:
                score += 6
                match_reasons.append(f"Name contains '{keyword}'")
        
        # Description match
        for keyword in keywords:
            if keyword in description and len(keyword) > 3:
                score += 3
                match_reasons.append("Description match")
        
        # Cultural match
        if cuisine and cuisine in cultural:
            score += 5
            match_reasons.append(f"Cultural match: {cultural}")
        
        # Ingredient match
        for ing in ingredients:
            if ing in name or ing in description:
                score += 7
                match_reasons.append(f"Has ingredient: {ing}")
        
        # Budget fit
        budget = parsed_query.get('constraints', {}).get('budget')
        if budget and recipe.get('estimatedCost', 0) <= budget:
            score += 4
            match_reasons.append("Within budget")
        
        # Time fit
        time_limit = parsed_query.get('constraints', {}).get('time')
        if time_limit and recipe.get('cookingTimeMinutes', 999) <= time_limit:
            score += 3
            match_reasons.append("Quick cooking time")
        
        # Rating bonus
        rating = recipe.get('rating', 0)
        score += rating * 0.5
        
        if score > 0:
            scored_results.append({
                'recipe': recipe,
                'score': score,
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
