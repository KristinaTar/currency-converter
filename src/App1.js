import React, {useEffect, useState} from 'react';
import {Container, FormControl, InputGroup} from "react-bootstrap";


function App(props){

    const [currencyArray, setCurrencyArray] = useState("");
    //setCurrencyArray змінює значення currencyArray
    //Кожного разу коли currencyArray змінюється, компонента рендериться заново
    const[hryvnaValue, setHryvnaValue]= useState(0);
    const[fetchData, setFetchData]= useState([]);

    useEffect(()=>{
        getCurrencyJsx();
    }, []);

    useEffect(()=>{
        let data = createCurrencyJsx(fetchData);
        setCurrencyArray(data);//передаєм сюди значення, яке треба присвоїти змінній currencyArray
    }, [hryvnaValue]);


    function createCurrencyJsx(input){
        let data=input.map((e, index)=>(<>
                <InputGroup size="lg" style={{width: 300, margin: 'auto', paddingTop: 15}}><InputGroup.Text
                    id="inputGroup-sizing-lg">{e.cc} </InputGroup.Text>
                    <FormControl value={Math.round(hryvnaValue/e.rate * 100) / 100}
                                 onChange={(event)=>setHryvnaValue(event.target.value * e.rate)} />
                </InputGroup>
                <div style={{textAlign: 'right', width: 300, margin: 'auto', fontSize: '12px'}}>{e.txt}</div>
            </>
        ));
        return data;

    }
    async function getCurrencyJsx() {
        let response = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
        let json = await response.json();
        setFetchData(json);

        let data=createCurrencyJsx(json);
        setCurrencyArray(data);//передаєм сюди значення, яке треба присвоїти змінній currencyArray

        console.log("Initiation succesfull!");
    }
    return (

      <Container fluid
                 style={{
                     backgroundColor: '#a8c1d9',
                     opacity: 0.8,
                     width: 400,
                     borderRadius: 25, textAlign: 'center', margin: 'auto', padding: '20px 20px 40px 20px'}}>
          <InputGroup size="lg" style={{width: 300, margin: 'auto', paddingTop: 15}}><InputGroup.Text
              id="inputGroup-sizing-lg">UAH </InputGroup.Text>
              <FormControl value={hryvnaValue}
                           onChange={(event)=>setHryvnaValue(event.target.value)} />
          </InputGroup>
          <div style={{textAlign: 'right', width: 300, margin: 'auto', fontSize: '12px'}}>UAH</div>
          {currencyArray}


      </Container>
  );
}

export default App;
