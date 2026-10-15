from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import List

app = FastAPI(title="Simple CRUD App")

items_db: List[dict] = [
    {"id": 1, "name": "Sample Item", "description": "This is a demo record"},
    {"id": 2, "name": "Another Item", "description": "You can edit or delete this"},
]


class Item(BaseModel):
    name: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class ItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


@app.get("/")
def read_root():
    return FileResponse("static/index.html")


@app.get("/items")
def get_items():
    return items_db


@app.get("/items/{item_id}")
def get_item(item_id: int):
    for item in items_db:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")


@app.post("/items", status_code=201)
def create_item(item: Item):
    new_item = {
        "id": (items_db[-1]["id"] + 1) if items_db else 1,
        "name": item.name,
        "description": item.description,
    }
    items_db.append(new_item)
    return new_item


@app.put("/items/{item_id}")
def update_item(item_id: int, item: ItemUpdate):
    for index, item_data in enumerate(items_db):
        if item_data["id"] == item_id:
            if item.name is not None:
                item_data["name"] = item.name
            if item.description is not None:
                item_data["description"] = item.description
            return item_data
    raise HTTPException(status_code=404, detail="Item not found")


@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    for index, item in enumerate(items_db):
        if item["id"] == item_id:
            deleted = items_db.pop(index)
            return {"message": "Item deleted", "deleted_item": deleted}
    raise HTTPException(status_code=404, detail="Item not found")


app.mount("/static", StaticFiles(directory="static"), name="static")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
