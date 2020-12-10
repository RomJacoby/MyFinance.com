import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'

export default class NavigationBar extends Component{
    render(){
        return(
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">MyFinance.com</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/Stocks">Stocks</Nav.Link>
                        <Nav.Link href="/Indices">Indices</Nav.Link>
                        <Nav.Link style={{position:"absolute",left:"95%"}}><i className="material-icons">accessible</i></Nav.Link>
                    </Nav>  
                </Navbar>
        )
    }
}