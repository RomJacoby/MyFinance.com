import yfinance as yf
import plotly.express as px
from flask import jsonify
stock = '^IXIC'

#dataframe = yf.Ticker(stock)
#companyName = dataframe.info["shortName"]
df_new = yf.download(stock,start="2018-07-21", end="2020-07-21")
df_new = df_new.reset_index() 
df_new["Value"] = df_new["Close"].astype('float64')
df_new = df_new.drop(columns=['Close','Open','High','Low','Adj Close','Volume'])
#this is the response string for the get_stock request, it contains stock name, values. (i want to add company name)
response_string = stockName +',' + date_string + "NowValues," + values_string
date_string = ""
values_string = ""
i = 0
for date in df_new["Date"]:
    formattedDate = date.strftime('%Y/%m/%d')
    date_string += formattedDate + ","
for value in df_new["Value"]:
    i += 1
    if i == df_new["Value"].size:
        values_string += str(value)
    else:
        values_string += str(value) + ","
    
print(date_string)
print(values_string) 
#fig = px.line(x=df_new["Date"].values, y=df_new["Value"].values)
#fig.show()
