import pandas as pd
from pandas_datareader import data as web
import yfinance as yf
import plotly.express as px
stock = 'MSFT'

df = yf.Ticker(stock)
companyName = df.info["shortName"]
df_new = df.history(start="2019-07-21", end="2020-07-21")
df_new.head()
df_new = df_new.reset_index() 
df_new["Value"]  =  df_new["Close"].astype('float64')
fig = px.line(df_new, x="Date", y="Value",title=companyName + ' Stock Prices')
fig.show()
