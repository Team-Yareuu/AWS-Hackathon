from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.services.bedrock_agent import BedrockAgent
from app.db.session import get_session
from neo4j import AsyncSession
import json
from typing import cast
from neo4j import Query

router = APIRouter()

class AssistantQuery(BaseModel):
    question: str
    context: str

@router.post("/search")
async def search(query: str, session: AsyncSession = Depends(get_session)):
    bedrock_agent = BedrockAgent()
    extracted_entities_str = bedrock_agent.invoke_claude(
        f"Extract entities from the following query: '{query}'. The entities are ingredients, taste, and budget. Return the result in JSON format."
    )
    extracted_entities = json.loads(extracted_entities_str)

    # Build Cypher query
    parts = ["MATCH (r:Recipe)"]
    params = {}

    if "ingredients" in extracted_entities and extracted_entities["ingredients"]:
        parts.append("MATCH (r)-[:HAS_INGREDIENT]->(i:Ingredient) WHERE i.name IN $ingredients")
        params["ingredients"] = extracted_entities["ingredients"]
    
    if "taste" in extracted_entities and extracted_entities["taste"]:
        parts.append("AND r.description CONTAINS $taste")
        params["taste"] = extracted_entities["taste"]

    if "budget" in extracted_entities and extracted_entities["budget"]:
        try:
            budget = float(extracted_entities["budget"])
            parts.append("AND r.estimatedCost < $budget")
            params["budget"] = budget
        except (ValueError, TypeError):
            # Ignore invalid budget value
            pass

    parts.append("RETURN r")
    cypher_query = " ".join(parts)

    result = await session.run(cast(Query, cypher_query), params)
    recipes = await result.values()
    return recipes

@router.post("/assistant")
async def assistant(query: AssistantQuery):
    bedrock_agent = BedrockAgent()
    prompt = f"Based on the following recipe context, answer the user\'s question.\n\nContext: {query.context}\n\nQuestion: {query.question}"
    answer = bedrock_agent.invoke_claude(prompt)
    return {"answer": answer}
