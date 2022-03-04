import * as React from 'react';
import ReactDOM from 'react-dom';

const DG = require('2gis-maps');

import './css/index.scss';
import App from './App';
import {store} from "./state/store";
import {Provider} from "react-redux";
import { BrowserRouter } from 'react-router-dom';

DG.plugin('https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js')
    .then(
        function () {
            ReactDOM.render(
                <BrowserRouter>
                    <Provider store={store}>
                        <App/>
                    </Provider>
                </BrowserRouter>,
                document.getElementById('root')
            );
        }
    )

