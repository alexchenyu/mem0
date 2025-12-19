from datetime import datetime
from typing import List, Optional, Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class MemoryBase(BaseModel):
    content: str
    metadata_: Optional[dict] = Field(default_factory=dict)

class MemoryCreate(MemoryBase):
    user_id: UUID
    app_id: UUID


class Category(BaseModel):
    name: str


class App(BaseModel):
    id: UUID
    name: str


class Memory(MemoryBase):
    id: UUID
    user_id: UUID
    app_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    state: str
    categories: Optional[List[Category]] = None
    app: App

    model_config = ConfigDict(from_attributes=True)

class MemoryUpdate(BaseModel):
    content: Optional[str] = None
    metadata_: Optional[dict] = None
    state: Optional[str] = None


class MemoryResponse(BaseModel):
    id: UUID
    content: str
    created_at: int
    state: str
    app_id: UUID
    app_name: str = ""
    categories: List[str] = []
    metadata_: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_fields(cls, data: Any) -> Any:
        """Extract app_name and categories from related objects"""
        # Create a new dict to avoid modifying SQLAlchemy objects
        result = {}
        
        if hasattr(data, "__dict__"):
            # SQLAlchemy object
            result.update({
                "id": data.id,
                "content": data.content,
                "created_at": data.created_at,
                "state": data.state,
                "app_id": data.app_id,
                "metadata_": getattr(data, "metadata_", None)
            })
            
            # Extract app_name
            if hasattr(data, "app") and data.app:
                result["app_name"] = data.app.name
            else:
                result["app_name"] = ""
            
            # Extract categories
            if hasattr(data, "categories") and data.categories:
                result["categories"] = [cat.name for cat in data.categories]
            else:
                result["categories"] = []
                
        elif isinstance(data, dict):
            # Dict input
            result = data.copy()
            
            # Extract app_name from app relationship
            if "app" in result and result["app"]:
                app = result["app"]
                if isinstance(app, dict) and "name" in app:
                    result["app_name"] = app["name"]
                elif hasattr(app, "name"):
                    result["app_name"] = app.name
            
            # Extract categories from categories relationship
            if "categories" in result and result["categories"]:
                categories = result["categories"]
                category_names = []
                for cat in categories:
                    if isinstance(cat, dict) and "name" in cat:
                        category_names.append(cat["name"])
                    elif hasattr(cat, "name"):
                        category_names.append(cat.name)
                result["categories"] = category_names
        
        return result

    @field_validator("created_at", mode="before")
    @classmethod
    def convert_to_epoch(cls, v):
        if isinstance(v, datetime):
            return int(v.timestamp())
        return v

class PaginatedMemoryResponse(BaseModel):
    items: List[MemoryResponse]
    total: int
    page: int
    size: int
    pages: int
