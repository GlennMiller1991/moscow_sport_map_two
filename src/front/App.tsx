import * as React from 'react';
import EventEmitter from 'events';
import MapMain from './MapMain';
import {IObj} from '../mid/misc/types';
import districts from './mock/districts.json';
import './App.scss';
import {Header} from './Header/Header';
import {Footer} from './Footer/Footer';
import {Sidebar} from './Sidebar/Sidebar';
import {LoginPage} from './LoginPage/LoginPage';
import Table from './Table';
import {useCallback, useState} from "react";
import {buttonsType, filterType} from "./state/appReducer";
import {useSelector} from "react-redux";
import {stateType} from "./state/store";

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

export const MainScreen: React.FC = React.memo(() => {
    console.log('from mainScreen')

    //state
    const emitter = new EventEmitter();
    const filter = useSelector<stateType, filterType>(state => state.appState.filter)
    const buttonsState = useSelector<stateType, buttonsType>(state => state.appState.buttonsValue)
    const objs = useSelector<stateType, Array<IObj>>(state => state.appState.objs)

    //functions
    const applyFilter = useCallback((objs: IObj[], filter: filterType) => {
        // filtering before every render
        // Rendering on each change select value and blur input field
        // If objects are mock and hard coded there is no difference between
        // old and new filter behavior
        return objs.filter((obj) => {
            let res = true;

            if (filter.affinityId) {
                res = res && obj.affinityId === filter.affinityId;
            }

            if (filter.sportId) {
                res = res && !!obj.parts.filter(part => {
                    return (part.roles as any).includes('' + (filter.sportId as any));
                }).length;
            }

            if (filter.zonetypeId) {
                res = res && !!obj.parts.filter(part => {
                    return +part.sportzonetypeId === filter.zonetypeId;
                }).length;
            }

            if (filter.name) {
                res = res && obj.name.toLowerCase().includes(filter.name.toLowerCase());
            }

            if (filter.org) {
                res = res && obj.org?.toLowerCase().includes(filter.org.toLowerCase());
            }

            if (filter.sportzone) {
                res = res && !!obj.parts.filter(part => {
                    return part.sportzone?.toLowerCase().includes(filter.sportzone.toLowerCase());
                }).length;
            }

            return res;
        });
    }, [])
    return (
        <>
            <Header/>
            <div className="mapContainer">
                <MapMain
                    objs={applyFilter(objs, filter)}
                    emitter={emitter}
                    isPopulationLayer={buttonsState.isPopulationLayer}
                    isCoverNet={buttonsState.isCoverNet}
                    isAvailOnClick={buttonsState.isAvailOnClick}
                    districts={districts as any} /* IDistrict[] */
                    sportId={filter.sportId}
                />
            </div>
            <div style={{clear: 'both'}}/>
            <div className="analytics">
                <Table
                    objs={objs}
                    filter={filter}
                />
            </div>
            <Sidebar emitter={emitter}
                     buttonsState={buttonsState}
            />
            <Footer/>
        </>
    );
})