import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
const apiUrl = process.env.REACT_APP_API_URL || "https://api.127.0.0.1.xip.io";

function App() {
  const [apiStatus, setApiStatus] = useState(false);
  useEffect(() => {
    try {
      fetch(apiUrl)
        .then(res => res.json())
        .then(res => {
          console.log("api response:", res);
          setApiStatus(res.success);
        });
    } catch (err) {
      console.error(err);
      setApiStatus(false);
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React I am testing the app for real time.
        </a>
        <div>api status: {apiStatus ? "good" : "bad"}</div>
      </header>
    </div>
  );
}

export default App;
