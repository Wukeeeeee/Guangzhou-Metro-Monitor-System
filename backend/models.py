from sqlalchemy import Column,Integer,String,Float,Boolean,DateTime,ForeignKey,create_engine
from sqlalchemy.orm import declarative_base,relationship
from datetime import datetime

Base=declarative_base()

class Station(Base):
    __tablename__='stations'
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    name=Column(String,index=True)
    longitude=Column(Float)
    latitude=Column(Float)


class Stationinfo(Base):
    __tablename__='stationinfo'
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    name=Column(String,index=True)
    istransfer=Column(Boolean)
    transferInfo=Column(String)
    flow=Column(Integer)
    updatetime=Column(DateTime, default=datetime.now)

class Dashboard(Base):
    __tablename__='dashboard'
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    onlineTrains=Column(Integer)
    onTimeRate=Column(Float)
    systemStatus=Column(String)
    updatetime=Column(DateTime, default=datetime.now)

class Stationstatus(Base):
    __tablename__='stationstatus'
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    name=Column(String,index=True)
    status=Column(Boolean)
    statusinfo=Column(String)
    errortime=Column(String)
    updatetime=Column(DateTime, default=datetime.now)


