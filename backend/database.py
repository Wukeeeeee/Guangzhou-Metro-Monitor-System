from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = f"sqlite:///{BASE_DIR}/data/metro.db"

engine=create_engine(DATABASE_URL,echo=False)
SessionLocal=sessionmaker(bind=engine)

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()