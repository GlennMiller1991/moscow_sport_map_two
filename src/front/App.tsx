import * as React from 'react';
import './App.scss';
import {LoginPage} from './LoginPage/LoginPage';
import {useSelector} from "react-redux";
import {stateType} from "./state/store";
import {MainScreen} from "./MainScreen/MainScreen";

export interface IFilter {
    affinityId?: number,
    sportId?: number,
    zonetypeId?: number,
    name?: string,
    org?: string,
    sportzone?: string,
}

function App() {
    console.log('from function component')
    const isEntranceRemoved = useSelector<stateType, boolean>(state => state.appState.isEntranceRemoved)
    if (!isEntranceRemoved) {
        return <LoginPage/>;
    } else {
        return <MainScreen/>
    }
}

export default App;

