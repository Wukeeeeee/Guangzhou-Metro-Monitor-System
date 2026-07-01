from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

#数据库的位置
BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = f"sqlite:///{BASE_DIR}/data/metro.db"

#创建数据库引擎
engine=create_engine(DATABASE_URL,echo=False)
#创建数据库会话
#绑定数据库引擎
SessionLocal=sessionmaker(bind=engine)

def get_db():
    #创建一个本地连接
    db=SessionLocal()
    try:
        #使用yield关键字返回数据库会话对象
        yield db
    finally:
        db.close()