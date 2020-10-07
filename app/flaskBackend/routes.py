from flaskBackend import application
from flask import request,jsonify
from . import db
from .models import Stock,Index
import yfinance as yf

@application.route('/')
def home():
    return 'homepage'

@application.route('/get_all_stocks')
def get_all_stocks():
    stock_list = Stock.query.all()
    stock = stock_list[0]
    #passing only one df for now
    #need to find a way to retrieve stock company name
    dataframe = yf.download(stock.name,start="2018-07-21", end="2020-07-21")
    #companyName = dataframe.info["shortName"]
    dataframe = dataframe.reset_index() 
    dataframe["Value"] = dataframe["Close"].astype('float64')
    dataframe_json = dataframe.to_json()
    return dataframe_json 
    
@application.route('/add_stock',methods=['POST'])
def add_stock():
    stock = request.args.get('stockName')
    db.session.add(Stock(name = stock))
    db.session.commit()
    return 'Added stock',201

@application.route('/add_index',methods=['POST'])
def add_index():
    index = request.args.get('indexName')
    db.session.add(Index(name = index))
    db.session.commit()
    return 'Added index',201