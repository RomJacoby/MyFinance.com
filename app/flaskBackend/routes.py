from flaskBackend import application
from flask import render_template,jsonify,request
from flaskBackend.forms import LoginForm
from . import db
from .models import Stock

@application.route('/')
def home():
    return render_template('home.html',funornot='amazing!')

@application.route('/get_stocks')
def get_stocks():
    stock_list = Stock.query.all()
    stocks = []
    for stock in stock_list:
        stocks.append({'name':stock.name, 'compnayName':stock.companyName})
    return jsonify({'stocks':stocks})

@application.route('/add_stock',methods=['POST'])
def add_stock():
    stock_data = request.get_json()
    new_stock = Stock(name=stock_data['name'], companyName=stock_data['companyName'])
    db.session.add(new_stock)
    db.session.commit()

    return 'Done',201

@application.route('/login')
def login():
    form = LoginForm()
    return render_template('login.html',title='please log in',form=form)