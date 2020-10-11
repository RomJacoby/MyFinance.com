import React, { Component } from 'react';
import StockList from './Components/StockList'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './Components/NavigationBar'
import CripplesPage from './Components/CripplesPage'
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Components/Home';

class App extends Component{
  render(){
    return (
      <div>
        <NavigationBar/>
        <Router>
          <Switch>
            <Route path="/Stocks">
              <StockList />
            </Route>
            <Route path="/">
              <div className="container">
                <Home />
              </div>  
            </Route>
            <Route path="/The_cripples_page"><CripplesPage /></Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
