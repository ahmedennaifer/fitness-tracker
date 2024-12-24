from fastapi import FastAPI

app = FastAPI()


@app.get("/home")
async def root() -> dict:
    return {"message": "hello world"}
