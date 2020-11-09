from flask import Flask
import sys, os
sys.path.append('/app/')
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

application = Flask(__name__)
cors = CORS(application)
application.config.from_object(Config)
db = SQLAlchemy(application)

from flaskBackend import routes, models
