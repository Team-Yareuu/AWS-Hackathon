from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class Quantity(BaseModel):
    value: Optional[float] = None
    unit: Optional[str] = None


class IngredientItem(BaseModel):
    name: str
    quantity: Optional[Quantity] = None
    notes: Optional[str] = None
    substitutes: List[str] = Field(default_factory=list)


class IngredientDetail(BaseModel):
    name: str
    quantity: Optional[Quantity] = None
    estimatedPrice: Optional[float] = None
    note: Optional[str] = None


class StoreLocation(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None


class OfflineStore(BaseModel):
    name: str
    address: Optional[str] = None
    openingHours: Optional[str] = None
    estimatedDistance: Optional[float] = None
    location: Optional[StoreLocation] = None
    rincianBahan: List[IngredientDetail] = Field(default_factory=list)


class BudgetData(BaseModel):
    offlineStores: List[OfflineStore] = Field(default_factory=list)


class RegionalVariation(BaseModel):
    region: str
    province: Optional[str] = None
    difference: Optional[str] = None


class CulturalStory(BaseModel):
    shortStory: Optional[str] = None
    fullStory: Optional[str] = None
    regionalVariations: List[RegionalVariation] = Field(default_factory=list)


class CookingStep(BaseModel):
    step: int
    title: str
    description: str
    duration: Optional[str] = None
    difficulty: Optional[str] = None
    image: Optional[str] = None
    tips: List[str] = Field(default_factory=list)


IngredientGroup = Dict[str, List[IngredientItem]]


class RecipeBase(BaseModel):
    name: str
    shortDescription: Optional[str] = None
    image: Optional[str] = None
    region: Optional[str] = None
    difficulty: Optional[str] = None
    cookingTimeMinutes: Optional[int] = None
    servings: Optional[int] = None
    estimatedCost: Optional[int] = None
    isTraditional: Optional[bool] = None
    isNew: Optional[bool] = None
    culturalStory: Optional[CulturalStory] = None
    budgetData: Optional[BudgetData] = None
    ingredients: List[IngredientGroup] = Field(default_factory=list)
    cookingSteps: List[CookingStep] = Field(default_factory=list)


class RecipeCreate(RecipeBase):
    id: str


class Recipe(RecipeBase):
    id: str

    class Config:
        from_attributes = True
