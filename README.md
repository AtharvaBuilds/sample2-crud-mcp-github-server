# Simple FastAPI CRUD App

This is a very simple CRUD application built with Python, FastAPI, HTML, CSS, and JavaScript.

## Features
- Create item
- Read items
- Update item
- Delete item

## Run locally

```bash
cd d:\GEN_AI\MCP
python -m pip install -r requirements.txt
python main.py
```

Then open:

```text
http://127.0.0.1:8000/
```

## Run with Docker

```bash
docker build -t sample2-crud-mcp-github-server .
docker run -p 8000:8000 sample2-crud-mcp-github-server
```

Then open:

```text
http://localhost:8000/
```
