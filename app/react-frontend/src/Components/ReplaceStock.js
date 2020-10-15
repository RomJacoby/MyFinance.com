import React,{useState} from 'react'
import axios from "axios"
import { Button,Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function ReplaceStock(props) {
    const [show, setShow] = useState(false);
    const [stockName, setStockName] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function onSubmit(e){
        e.preventDefault();
        const newStockName = stockName;
        
        //Closes window
        handleClose()

        axios.post('http://localhost:5000/replace_stock',{},{headers:{'Access-Control-Allow-Origin': '*'},params:{stockName:newStockName,previousStockName:props.stockName}})
        .then (res => {
            console.log(res.data)
            
            //Refresh page
            window.location.reload(false)
        })
    }
    
    return (
        <>
            <button className="btn" style={{backgroundColor:"transparent",position:"absolute",left:"9%",top:"3%"}} onClick={handleShow}>
                <i className="material-icons" style={{fontSize:"1.8em",position:"absolute",left:"9%",top:"3%"}}>edit</i>
            </button>
            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Replace Stock</Modal.Title>
                </Modal.Header>
                <form onSubmit={onSubmit}>
                    <Modal.Body>
                        <input type="text"
                            required
                            className="form-control"
                            value={stockName}
                            onChange={(e) => setStockName(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Replace</Button>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default ReplaceStock;