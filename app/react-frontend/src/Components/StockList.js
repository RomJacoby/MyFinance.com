import axios from "axios"
import React, {Component} from 'react'
import { Row,Card,CardDeck } from "react-bootstrap";
import Plot from 'react-plotly.js';

export default class StockList extends Component{
    constructor(){
        super();
        this.state = {
            stocks:[],
            colorArr:["#B22222","#20B2AA","#FFA500","#87CEEB","#483D8B","#000000","#556B2F"],
            datesArr:[],
            valuesArr:[],
            stockName:""
        }
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
        var i = Math.floor(Math.random()*this.state.colorArr.length)
        var randomColor = this.state.colorArr[i];
        this.setState((state) => {
            state.colorArr.splice(i,1)
            return {colorArr:state.colorArr}
        })
        return randomColor;
    }
    
    create_body(){
        var body = []
        return body = this.state.stocks.map( stock => {
            var str = String(stock)
            var responseArr = str.split(",")
            var i = 0
            var isDate = true
            
            for (i=0;i<responseArr.length;i++){
                if (i == 0){this.setState({stockName:responseArr[i]})}
                else if ( responseArr[i] === "NowValues" ){ isDate = false }   
                else if ( isDate == true )
                {
                    this.setState((state) => {
                        state.datesArr.push(responseArr[i])
                        return {datesArr:state.datesArr} 
                    })
                }
                else if (isDate == false)
                {
                    this.setState((state) => {
                        state.valuesArr.push(responseArr[i])
                        return {valuesArr:state.valuesArr} 
                    })
                }
            }
            
            var i = 0
            var datesArr2 = this.state.datesArr
            datesArr2.forEach(date => { 
                var parts = String(date).split('/');
                datesArr2[i] = new Date(parts[0],parts[1] - 1,parts[2]);
                i++;
            });
            this.setState({datesArr:datesArr2})
            return(
                <div ><Card border="secondary"><Card.Body><Card.Title style={{textAlign:"Center"}}><i className="material-icons" style={{fontSize:"1.5em",position:"absolute",left:"9%",top:"3%"}}>edit</i>{this.state.stockName}</Card.Title><Plot
                    data={[
                    {
                        x: this.state.datesArr,
                        y: this.state.valuesArr,
                        fill: "tonexty",
                        type: 'line',
                        line:{color:this.getRandomColor()}
                        
                    }
                    ]}
                    layout={ {plot_bgcolor:'#FAF0E6',margin:{l:"30",r :"30",t:"5",b:"30"},width:496,height:400}}/>
                    </Card.Body></Card>
                </div>
            )
        })
    }
    
    render(){ 
        return (<div><CardDeck style={{margin:"5%"}}>{this.create_body()}</CardDeck></div>)
    }

}