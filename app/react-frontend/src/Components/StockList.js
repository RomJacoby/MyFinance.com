import axios from "axios"
import React, {Component} from 'react'
import { Row,Card,CardDeck } from "react-bootstrap";
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
            Object.keys(res.data).forEach(k => {
                stocks_arr.push(res.data[k])
            })
            this.setState({stocks:stocks_arr})
        } )
    }
    
    getRandomColor() {
        var colorArr=["#B22222","#20B2AA","#FFA500","#87CEEB","#483D8B","#000000","#556B2F"]
        var randomColor = colorArr[Math.floor(Math.random()*colorArr.length)];
        return randomColor;
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
            <div ><Card border="secondary"><Card.Body><Card.Title style={{textAlign:"Center"}}><i className="material-icons" style={{fontSize:"1.5em",position:"absolute",left:"9%",top:"3%"}}>edit</i>{stockName}</Card.Title><Plot
                data={[
                {
                    x: datesArr,
                    y: valuesArr,
                    fill: "tonexty",
                    type: 'line',
                    line:{color:this.getRandomColor()}
                    
                }
                ]}
                layout={ {plot_bgcolor:'#FAF0E6',margin:{l:"30",r :"30",t:"5",b:"30"},width:496,height:400}}/>
                </Card.Body></Card>
            </div>
        )
    }
    
    render(){
        var stock_list = this.state.stocks
        var body = []
        stock_list.forEach(stock => {
            body.push(this.create_plot(stock))
        });
        return (<div><CardDeck style={{margin:"5%"}}>{body}</CardDeck></div>)
    }

}