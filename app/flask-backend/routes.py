from 'flask-backend' import application
from flask import request,jsonify
from flask_cors import CORS, cross_origin
from . import db
from datetime import datetime
from .models import Stock,Index
import yfinance as yf

def get_last_month():
    today = datetime.today()
    if today.month == 1:
        one_month_ago = today.replace(year=today.year - 1, month=12)
    else:
        extra_days = 0
        while True:
            try:
                one_month_ago = today.replace(month=today.month - 1, day=today.day - extra_days)
                break
            except ValueError:
                extra_days += 1
    return one_month_ago.strftime('%Y-%m-%d')

def get_stock(stock):
    
    #Get today's time
    today = datetime.today().strftime('%Y-%m-%d')
    #I need to find a way to retrieve stock company name, and to see if i can get multiple stocks in one hit
    dataframe = yf.download(stock.name,start=get_last_month(), end=today)
    #companyName = dataframe.info["shortName"]
    dataframe = dataframe.reset_index() 
    dataframe["Value"] = dataframe["Close"].astype('float64')
    dataframe = dataframe.drop(columns=['Close','Open','High','Low','Adj Close','Volume'])
    
    dates_string = ""
    values_string = ""
    
    i = 0
    for date in dataframe["Date"]:
        formattedDate = date.strftime('%Y/%m/%d')
        dates_string += formattedDate + ","
    for value in dataframe["Value"]:
        i += 1
        if i == dataframe["Value"].size:
            values_string += str(value)
        else:
            values_string += str(value) + ","

    #This is the response string for the get_stock request, it contains stock name,dates and values. (i want to add company name)
    response_string = stock.name +',' + dates_string + "NowValues," + values_string
    return response_string

@application.route('/get_all_stocks')
@cross_origin()
def get_all_stocks():
    stock_list = Stock.query.all()
    json_stocks = {}
    i = 0
    for stock in stock_list:
        json_stocks[i] = get_stock(stock)
        i += 1   
    return (json_stocks)
    
@application.route('/replace_stock',methods=['POST'])
@cross_origin()
def replace_stock():
    newStock = request.args.get('stockName')
    previousStock = request.args.get('previousStockName')
    foundStock = Stock.query.filter_by(name=previousStock).first()
    foundStock.name = newStock
    db.session.commit()
    return "Replaced, ya"

@application.route('/get_all_indices')
@cross_origin()
def get_all_indices():
    index_list = Index.query.all()
    json_indices = {}
    i = 0
    for index in index_list:
        json_indices[i]=get_stock(index)
        i +=1
    return (json_indices)

@application.route('/replace_index',methods=['POST'])
@cross_origin()
def replace_index():
    newIndex = request.args.get('indexName')
    previousIndex = request.args.get('previousIndexName')
    foundIndex = Index.query.filter_by(name=previousIndex).first()
    foundIndex.name = newIndex
    db.session.commit()
    return "Replaced, ya"