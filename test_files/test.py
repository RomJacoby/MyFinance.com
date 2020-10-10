import yfinance as yf
import matplotlib.pyplot as plt


#define the ticker symbol
tickerSymbol = '^IXIC'
plt.style.use('ggplot')

#get data on this ticker
#tickerData = yf.Ticker(tickerSymbol)
#print(tickerData.info)
#companyName = tickerData.info["shortName"]
#get the historical prices for this ticker
#tickerDf = tickerData.history(start='2010-1-1', end='2020-1-25')

'''
#see your data
tickerDf = tickerDf.reset_index()
for i in ['Open', 'High', 'Close', 'Low']: 
      tickerDf[i]  =  tickerDf[i].astype('float64')
tickerDf.plot(x ='Date', y = 'Close', kind = 'line',title = companyName, legend=None)

plt.show()'''

arr = ["1","2"]
arr.length()