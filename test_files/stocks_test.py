import yfinance as yf
import plotly.express as px
stock = '^IXIC'

#dataframe = yf.Ticker(stock)
#companyName = dataframe.info["shortName"]
df_new = yf.download(stock,start="2018-07-21", end="2020-07-21")
df_new = df_new.reset_index() 
df_new["Value"] = df_new["Close"].astype('float64')
print (df_new)
fig = px.line(df_new, x="Date", y="Value")
fig.show()
