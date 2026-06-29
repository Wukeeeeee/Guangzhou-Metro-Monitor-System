import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response


app = FastAPI()
BASE_DIR = Path(__file__).resolve().parent.parent

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/cesium")
def getapi():
    token = (BASE_DIR / "fronted" / "apikey.txt").read_text(encoding="utf-8").strip()
    return {"token": token}


@app.get("/dashboard")
def getdashboard():
    return read_json(BASE_DIR / "data" / "dashboard.json")


@app.get("/status")
def getstatus():
    return read_json(BASE_DIR / "data" / "status.json")


@app.get("/ranking")
def getranking():
    station = read_json(BASE_DIR / "data" / "stations.json")
    return station["stations"]


@app.get("/stationPoint")
def getstationPoint():
    return read_json(BASE_DIR / "data" / "GZLine1_Station.geojson")


@app.get("/line")
def getline():
    return read_json(BASE_DIR / "data" / "GZLine1.geojson")


@app.get("/logo")
def getlogo():
    logo = (BASE_DIR / "fronted" / "GZmetro.jpg").read_bytes()
    return Response(content=logo, media_type="image/jpeg")


@app.get("/info")
def getinfo():
    return read_json(BASE_DIR / "data" / "stations.json")
