import axios from "axios"
import React, {Component} from 'react'
import Plot from 'react-plotly.js';

export default class StockList extends Component{
    constructor(){
        super();
        this.state = {
            stocks:[]
        }
        this.create_plot = this.create_plot.bind(this)
    };

    componentDidMount(){
        axios.get('http://localhost:5000/get_all_stocks')
        .then( res => {
            var stocks_arr = []
            console.log(res.data)
            Object.keys(res.data).forEach(k => {
                stocks_arr.push(res.data[k])
            })
            this.setState({stocks:stocks_arr})
        } )
    }
    
    create_plot(stock){
        var str = String(stock)
        var stockName = ""
        var datesArr = []
        var valuesArr = []
        var arr = str.split(",")
        var i = 0
        var isDate = true
        for (i=0;i<arr.length;i++){
            
            if (i == 0){ stockName = arr[0] }
            else if (arr[i] === "NowValues"){ isDate = false }   
            else if (isDate == true) { datesArr.push(arr[i]) }
            else if (isDate == false){ valuesArr.push(arr[i]) }
        }
        
        var i = 0
        datesArr.forEach(date => { 
            var parts = date.split('/');
            var newDate = new Date(parts[0],parts[1] - 1,parts[2]);
            datesArr[i] = newDate;
            i++;
        });
        return(
            <div><Plot
                data={[
                {
                    x: datesArr,
                    y: valuesArr,
                    type: 'line'
                }
                ]}
                layout={ {title: stockName} }/>
            </div>
        )
    }
    
    render(){
        var stock_list = this.state.stocks
        var body = []
        stock_list.forEach(stock => {
            body.push(this.create_plot(stock))
        });
        return (<div>{body}</div>)
    }

}