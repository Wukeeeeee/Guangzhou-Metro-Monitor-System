import json
from pathlib import Path

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import get_db
from .models import Station, Stationinfo, Dashboard, Stationstatus


app = FastAPI()


#E:\...\GZ-Metro-System\backend\main.py
#项目根目录为E:\...\GZ-Metro-System
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
    token = (BASE_DIR / "frontend" / "apikey.txt").read_text(encoding="utf-8").strip()
    return {"token": token}


@app.get("/dashboard")
def getdashboard(db: Session = Depends(get_db)):
    dashboardStatus = db.query(Dashboard).order_by(Dashboard.updatetime.desc()).first()
    if not dashboardStatus:
        return {"onTimeRate": "N/A", "onlineTrains": "N/A", "systemStatus": "N/A", "updatetime": ""}
    return {
        "onTimeRate": dashboardStatus.onTimeRate,
        "onlineTrains": dashboardStatus.onlineTrains,
        "systemStatus": dashboardStatus.systemStatus,
        "updatetime": dashboardStatus.updatetime}


@app.get("/status")
def getstatus(db: Session = Depends(get_db)):
    # 每个站取最新一条状态
    subq = db.query(
        Stationstatus.name,
        func.max(Stationstatus.updatetime).label("max_time")
    ).group_by(Stationstatus.name).subquery()

    latest = db.query(Stationstatus).join(
        subq,
        (Stationstatus.name == subq.c.name) &
        (Stationstatus.updatetime == subq.c.max_time)
    ).all()

    status_list = []
    for s in latest:
        status_list.append({
            "name": s.name,
            "status": "abnormal" if s.status else "normal",
            "statusinfo": s.statusinfo or "",
            "errortime": s.errortime or "",
            "message": s.statusinfo or "",
            "abnormaltime": s.errortime or "",
        })
    return {"status": status_list}


@app.get("/ranking")
def getranking(db: Session = Depends(get_db)):
    station_dict = []
    for station in db.query(Stationinfo).all():
        station_dict.append({
            "name": station.name,
            "flow": station.flow
        })
    return station_dict


@app.get("/stationPoint")
def getstationPoint(db: Session = Depends(get_db)):
    station_dict = []
    for station in db.query(Station).all():
        station_dict.append({
            "name": station.name,
            "longitude": station.longitude,
            "latitude": station.latitude
        })
    return {"geometries": station_dict}


@app.get("/line")
def getline():
    return read_json(BASE_DIR / "data" / "GZLine1.geojson")


@app.get("/logo")
def getlogo():
    logo = (BASE_DIR / "frontend" / "GZmetro.jpg").read_bytes()
    return Response(content=logo, media_type="image/jpeg")


@app.get("/info")
def getinfo():
    return read_json(BASE_DIR / "data" / "stations.json")
