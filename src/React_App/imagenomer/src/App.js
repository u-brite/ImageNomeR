import logo from './logo.svg';
// import json;
import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  
  const [data, setData] = useState();

  useEffect(() => {
    fetch('/data')
    .then(res => {
      console.log(res);
      return res.json();
    }).then(data => {
        console.log(data);
        setData(JSON.stringify(data));
      }).catch(e => {
      console.log(e);
    })
  //   fetch('https://jsonplaceholder.typicode.com/todos/1')
  // .then(response => {
  //   console.log(response);
  //   response.json()
  // })
  // .then(json => console.log(json))
  }, []);
  
  return (
    <div className="App">
      {data ? data : 'No data'}
      </div>
  );
}

export default App;
