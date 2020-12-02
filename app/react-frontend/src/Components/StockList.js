import axios from "axios"
import React, {Component} from 'react'
import { Card,CardDeck } from "react-bootstrap";
import Plot from 'react-plotly.js';
import AOS from 'aos';
import 'aos/dist/aos.css'
import ReplaceStock from './ReplaceStock'
AOS.init();

export default class StockList extends Component{
    constructor(){
        super();
        this.state = {
            stocks:[]
        }
    };

    //Pushing response stocks (as strings) to this.state.stocks, then calling a function to parse and arrange everything
    componentDidMount(){
        axios.get('http://' + process.env.REACT_APP_MY_HOST_IP  + ':5000/get_all_stocks')
        .then( res => {
            var stocks_arr = []
            Object.keys(res.data).forEach(k => {
                stocks_arr.push({data:res.data[k]})
            })
            this.setState({stocks:stocks_arr})
            this.update_state()
        })       
    }

    //This function is using my response from backend in order to update all state values
    update_state(){
        this.setState(state => {  
            
            //this is the final array, which this.state.stocks will be equal to.
            var stocksArr = []
            
            //Looping over the strings in order to parse them
            state.stocks.forEach( stock => {
                var datesArr = []
                var valuesArr = []
                var stockName = ""
                
                var str = String(stock.data)
                var responseArr = str.split(",")
                var isDate = true
                
                //Looping over and Fetching data from responseArr, manipulates it, and updates datesArr,valuesArr and stockName 
                for (var i=0;i<responseArr.length;i++){
                    if (i == 0){stockName = responseArr[i]}
                    else if ( responseArr[i] === "NowValues" ){ isDate = false }   
                    else if ( isDate == true )
                    {
                        var parts = String(responseArr[i]).split('/');
                        var date = new Date(parts[0],parts[1] - 1,parts[2]);
                        datesArr.push(date)
                    }
                    else if (isDate == false)
                    { 
                        valuesArr.push(responseArr[i])
                    }
                }
                //pushing each stock's details to stocksArr
                stocksArr.push({"datesArr":datesArr,"valuesArr":valuesArr,"stockName":stockName})
            })
            //returning new state 
            return {stocks:stocksArr}
        })
    }
    
    create_body(){
        var body = ""
        var colorArr = ["#B22222","#20B2AA","#FFA500","#87CEEB","#483D8B","#000000","#556B2F"]
        var zoomSide = "fade-left"
        //Looping over this.state.stocks, creating and returning the Plots' HTML
        return body = this.state.stocks.map( stock => {
            if (zoomSide === "fade-right") {zoomSide="fade-left"} else {zoomSide="fade-right"}
            return(
                <div data-aos={zoomSide} data-aos-duration="1500"><Card border="secondary">
                    <Card.Body>
                        <Card.Title style={{textAlign:"Center",fontSize:"1.7em"}}>
                            <ReplaceStock stockName={stock.stockName} />
                            {stock.stockName}
                        </Card.Title>
                        <Plot
                            data={[
                            {
                                x: stock.datesArr,
                                y: stock.valuesArr,
                                fill: "tonexty",
                                type: 'line',
                                line:{color:this.getRandomColor(colorArr)}    
                            }
                            ]}
                            layout={ {plot_bgcolor:'#FAF0E6',margin:{l:"30",r :"30",t:"5",b:"30"},width:496,height:400}}/>
                    </Card.Body>   
                </Card></div>
            )
        })
    }
    //Fetches a color from the color array and then popping the color out of it
    getRandomColor(colorArr) {
        var i = Math.floor(Math.random()*colorArr.length)
        var randomColor = colorArr[i];
        colorArr.splice(i,1)
        return randomColor;
    }

    render(){ 
        return (<div>
                    <h1 data-aos="zoom-in" data-aos-duration="1000" style={{textAlign:"center",fontWeight:"550"}}>Stocks</h1>
                    <br/>
                    <h3 data-aos="zoom-in-up" data-aos-duration="2000" className="text-muted" style={{textAlign:"center",fontStyle:"oblique",fontWeight:"lighter"}}>Your money, our pleasure.</h3>
                    <CardDeck style={{margin:"5%",marginTop:"3%"}}>{this.create_body()}</CardDeck>
                </div>)
    }

}
