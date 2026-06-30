import json
from pathlib import Path
from models import Base,Station,Stationinfo,Dashboard,Stationstatus
from database import engine,SessionLocal
from datetime import datetime

DASET_DIR = Path(__file__).parent.parent

def load_json(path):
    with open(path,encoding="utf-8") as f:
        return json.load(f)

def init_db():
    Base.metadata.create_all(bind=engine)
    db=SessionLocal()

    try:
        #导入站点经纬度
        station_data=load_json(DASET_DIR/'data'/'GZLine1_Station.geojson')
        for station in station_data['geometries']:
            #检测站点是否已存在
            existing = db.query(Station).filter_by(name=station['name']).first()
            if existing is None:
                StationSQL=Station(
                    name=station['name'],
                    longitude=station['coordinates'][0],
                    latitude=station['coordinates'][1],
                )
                db.add(StationSQL)
                db.commit()
            if existing:
                continue
        

        #导入站点信息
        stationinfo_data=load_json(DASET_DIR/'data'/'stations.json')
        #检测站点是否已存在,如果存在的话就更新时间,不存在则插入
        for station in stationinfo_data["stations"]:
            existing = db.query(Stationinfo).filter(Stationinfo.name ==station['name']).first()
            if existing:
                existing.flow = station['flow']
                existing.istransfer = station['istransfer']
                existing.updatetime =datetime.now() 
            if not existing:
                StationInfoSQL=Stationinfo(
                name=station['name'],
                istransfer=station['istransfer'],
                transferInfo=station['transferInfo'],
                flow=station['flow']
                )
                db.add(StationInfoSQL)
        db.commit()
    
        #导入dashboard信息
        dashboard_data=load_json(DASET_DIR/'data'/'dashboard.json')
        DashboardSQL=Dashboard(
            onTimeRate=dashboard_data['onTimeRate'],
            onlineTrains=dashboard_data['onlineTrains'],
            systemStatus=dashboard_data['systemStatus'],
            updatetime=datetime.now()
        )
        db.add(DashboardSQL)
        db.commit()


        #导入站点状态
        stationstatus_data=load_json(DASET_DIR/'data'/'status.json')
        for station in stationstatus_data["status"]:
            existing = db.query(Stationstatus).filter(Stationstatus.name ==station['name']).first()
            if existing:
                existing.status = station['status']
                existing.statusinfo = station['statusinfo']
                existing.errortime = station['errortime']
                existing.updatetime = datetime.now()
            if not existing:
                StationStatusSQL=Stationstatus(
                    name=station['name'],
                    status=station['status'],
                    statusinfo=station['statusinfo'],
                    errortime=station['errortime'],
                    updatetime=datetime.now()
                    )
                db.add(StationStatusSQL)

        db.commit()


        
    except Exception as e:
        print(e)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()


