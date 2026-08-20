# Fixing Vercel Python Entrypoint Error for FastAPI

Your deployment failed because Vercel could not find the configured Python entrypoint `main.py`. For FastAPI, follow these steps:

1. **Create Entry Point File**
   - Ensure you have `main.py` inside the root or `api/` directory.
   - Example structure:
     ```
     my-vercel-app/
     ├── api/
     │   └── main.py
     ├── requirements.txt
     └── vercel.json
     ```

2. **Define FastAPI Application**
   - Inside `main.py`, expose a top-level variable named `app`:
     ```python
     from fastapi import FastAPI

     app = FastAPI()

     @app.get("/")
     async def root():
         return {"message": "Hello from FastAPI on Vercel"}
     ```

3. **Configure vercel.json**
   - Explicitly tell Vercel to use Python runtime:
     ```json
     {
       "functions": {
         "api/main
