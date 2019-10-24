import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
const apiUrl = process.env.REACT_APP_API_URL || "https://api.127.0.0.1.xip.io";
const API_STATUS_SET = {
  GOOD: "GOOD",
  BAD: "BAD",
  LOADING: "LOADING",
  INIT: "INIT"
}

function App() {
  const [apiStatus, setApiStatus] = useState(API_STATUS_SET.INIT);
  useEffect(() => {
    try {
      setApiStatus(API_STATUS_SET.LOADING)
      fetch(apiUrl)
        .then(res => res.json())
        .then(res => {
          console.log("api response:", res);
          setApiStatus(res.success ? API_STATUS_SET.GOOD : API_STATUS_SET.BAD);
        });
    } catch (err) {
      console.error(err);
      setApiStatus(API_STATUS_SET.BAD);
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <span>api status:</span>
          <span className={`apistatus-badge ${apiStatus}`}>
            {apiStatus}
          </span>
          {apiStatus === API_STATUS_SET.BAD && <p>please check docker-compose</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
