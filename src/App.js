import React, {useEffect, useState} from 'react';
import {Container, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";



function App(props){

    const [currencyArray, setCurrencyArray] = useState("");
    //setCurrencyArray змінює значення currencyArray
    //Кожного разу коли currencyArray змінюється, компонента рендериться заново
    //const[hryvnaValue, setHryvnaValue]= useState(0);
    const[fetchData, setFetchData]= useState([]);//коли запустилась ф-ція setFetchData, то fetchData=json,
    const [startDate, setStartDate] = useState(new Date());

    useEffect(()=>{
        getCurrencyJsx();
    }, [startDate]);

    // useEffect(()=>{
    //     let data = createCurrencyJsx(fetchData);
    //     setCurrencyArray(data);//передаєм сюди значення, яке треба присвоїти змінній currencyArray
    // }, [hryvnaValue]);


    function createCurrencyJsx(json){
        let data=json.sort(compareCurrency).map((e)=>(<option value={e.rate}>{e.cc}</option>));
        return data;

    }

    function compareCurrency(a,b){
        if (a.cc > b.cc) return 1;
        if (a.cc == b.cc) return 0;
        if (a.cc < b.cc) return -1;
    }

    let inputRight=React.useRef();
    let inputLeft=React.useRef();
    let formSelectLeft=React.useRef();
    let formSelectRight=React.useRef();



    function changeInputRight(){
        if (typeof Number(inputLeft.current.value) !== 'number' || !isFinite(Number(inputLeft.current.value))){
            alert ('Please enter a valid number');
        }else{
            inputRight.current.value = Math.round(inputLeft.current.value * formSelectLeft.current.value / formSelectRight.current.value*100)/100;
        }
    }


    function changeInputLeft(){
        if (typeof Number(inputLeft.current.value) !== 'number' || !isFinite(Number(inputLeft.current.value))){
            alert ('Please enter a valid number');
        }else {
            inputLeft.current.value = Math.round(inputRight.current.value * formSelectRight.current.value / formSelectLeft.current.value * 100) / 100;
        }
    }


    async function getCurrencyJsx() {
        let response = await fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${startDate.getFullYear()}${("0"+(startDate.getMonth()+1)).slice(-2)}${("0"+startDate.getDate()).slice(-2)}&json`);
        let json = await response.json();
        setFetchData(json);//

        let data=createCurrencyJsx(json);// тут дата стає масивом розміток (<option value={e.rate}>{e.cc}</option>)
        setCurrencyArray(data);//передаєм сюди значення, яке треба присвоїти змінній currencyArray
        changeInputRight();
    }

    function switchCurrency() {
        let saveLeft = 0;// зберігаємо сюди значення лівого поля з валютами
        let saveRight=0;

        for (let key in formSelectLeft.current) {
            if (key == Number(key) && formSelectLeft.current[key].selected == true) {
                saveLeft=key;
            }// шукаємо і зберігаємо значення валюти Left
        }
        for (let key in formSelectRight.current) {
            if (key == Number(key) && formSelectRight.current[key].selected == true) {
                saveRight=key;
            }
        }
        formSelectRight.current[saveLeft].selected=true;
        formSelectLeft.current[saveRight].selected=true;
        changeInputRight();
    }


    return (
      <Container fluid
                 style={{
                     backgroundColor: '#a8c1d9',
                     opacity: 0.8,
                     width: 600,
                     borderRadius: 25, textAlign: 'center', margin: 'auto', padding: '20px 20px 40px 20px'}}>

          <div style={{fontFamily:'inherit', fontSize:'18px', fontWeight:500}}>Select the currency rate for the day
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
          </div>

          <Form.Control type="text" placeholder="Amount" style={{ width: 100, display:'inline', position:'relative'}} onInput={changeInputRight}  ref={inputLeft}  />
          <Form.Select aria-label="Default select example" style={{ width: 90, display:'inline', position:'relative'}} ref={formSelectLeft} onChange={changeInputRight}>
              <option value="1">UAH</option>
              {currencyArray}
          </Form.Select>

          {/*<i className="fas fa-long-arrow-alt-right" style={{fontSize: '35px',  marginTop: 'center', position: 'absolute', paddingLeft:'3px'}}  onClick={switchCurrency}></i>*/}
          <span onClick={switchCurrency} style={{fontSize: '40px', verticalAlign: '-14%'}} >
              <i className="fas fa-caret-left" style={{paddingRight:'3px'}}></i>
          <i className="fas fa-caret-right"></i>
          </span>

          <Form.Control type="text" placeholder="Amount" style={{ width: 100, display:'inline' }} ref={inputRight} onInput={changeInputLeft}  />
          <Form.Select aria-label="Default select example"  style={{ width: 90, display:'inline', position:'relative'}} ref={formSelectRight} onChange={changeInputRight}>
              <option value="1">UAH</option>
              {currencyArray}
          </Form.Select>

      </Container>


  );
}

export default App;
