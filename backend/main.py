from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import json
from pathlib import Path

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent.parent

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/cesium')
def getapi():
    token = (BASE_DIR / 'fronted' / 'apikey.txt').read_text(encoding='utf-8').strip()
    return {'token': token}

@app.get('/dashboard')
def getdashboard():
    with open(BASE_DIR / 'data' / 'dashboard.json', 'r', encoding='utf-8') as f:
        dashboard = json.load(f)
    return dashboard

@app.get('/status')
def getstatus():
    with open(BASE_DIR / 'data' / 'status.json', 'r', encoding='utf-8') as f:
        status = json.load(f)
    return status

@app.get('/ranking')
def getranking():
    with open(BASE_DIR / 'data' / 'stations.json', 'r', encoding='utf-8') as f:
        station = json.load(f)
    return station["stations"]

@app.get('/stationPoint')
def getstationPoint():
    with open(BASE_DIR / 'data' / 'GZLine1_Station.geojson', 'r', encoding='utf-8') as f:
        station = json.load(f)
    return station

@app.get('/line')
def getline():
    with open(BASE_DIR / 'data' / 'GZLine1.geojson', 'r', encoding='utf-8') as f:
        line = json.load(f)
    return line

@app.get('/logo')
def getlogo():
    with open(BASE_DIR / 'fronted' / 'GZmetro.jpg', 'rb') as f:
        logo = f.read()
    return Response(content=logo, media_type="image/jpeg")
