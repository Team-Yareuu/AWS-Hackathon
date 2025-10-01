from pydantic import BaseModel
from typing import List, Optional

class RecipeBase(BaseModel):
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    difficulty: Optional[str] = None
    cookingTime: Optional[int] = None
    servings: Optional[int] = None
    estimatedCost: Optional[int] = None
    region: Optional[str] = None

class RecipeCreate(RecipeBase):
    id: str

class Recipe(RecipeBase):
    id: str

    class Config:
        orm_mode = True
