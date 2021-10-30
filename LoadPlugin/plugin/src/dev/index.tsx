
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./skins/index";
import Index from '../index';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import "../components/Demo/locales/index";

ReactDOM.render(
    <React.StrictMode>
        <Index></Index>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals(console.log);
