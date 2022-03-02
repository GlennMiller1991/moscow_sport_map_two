import * as React from 'react';
import EventEmitter from 'events';

import MapMain from './MapMain';
import {IObj} from '../mid/misc/types';

import sprtObjs from './mock/sport_objects.json';
import districts from './mock/districts.json';

import {Select} from 'antd';

const {Option} = Select;

import './App.scss';

const limitMarkers = +Infinity;
import {Header} from './Header/Header';
import {Footer} from './Footer/Footer';
import {Sidebar} from './Sidebar/Sidebar';
import {LoginPage} from './LoginPage/LoginPage';

import Table from './Table';
import {useCallback, useState} from "react";

export type buttonsType = {
    isPopulationLayer: boolean,
    isCoverNet: boolean,
    isAvailOnClick: boolean,
}

export type filterType = {
    affinityId: number,
    sportId: number,
    zonetypeId: number,
    name: string,
    org: string,
    sportzone: string,
}

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
    const emitter = new EventEmitter;

    //state
    const [isEntranceRemoved, setIsEntranceRemoved] = useState(false)
    const [objs, setObjs] = useState<IObj[]>(sprtObjs as unknown as IObj[])
    const [filter, setFilter] = useState<filterType>({
        affinityId: 0,
        sportId: 0,
        zonetypeId: 0,
        name: '',
        org: '',
        sportzone: '',
    })
    const [buttonsState, setButtonsState] = useState<buttonsType>({
        isPopulationLayer: false,
        isAvailOnClick: false,
        isCoverNet: false,
    })


    //callbacks
    const onButtonPressHandler = useCallback((obj: Partial<buttonsType>) => {
        let resButtons = {...buttonsState, ...obj}
        const key = Object.keys(obj)[0]
        if (obj[key]) {
            if (key === 'isPopulationLayer') {
                resButtons['isCoverNet'] = false
            } else if (key === 'isCoverNet') {
                resButtons['isPopulationLayer'] = false
            }
        }

        setButtonsState(resButtons)
    }, [buttonsState])
    const onBlurHandler = useCallback((obj: Partial<filterType>) => {
        if (filter[Object.keys(obj)[0]] !== obj[Object.keys(obj)[0]]) {
            setFilter({...filter, ...obj})
        }
    }, [filter])
    const applyFilter = useCallback((objs: IObj[], filter: filterType) => {
        console.log('from applyFilter', filter)
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
    const onEnterClick = useCallback(() => {
        setIsEntranceRemoved(true)
    }, [])

    if (!isEntranceRemoved) {
        return (<LoginPage
            callback={onEnterClick}
        />);
    } else {
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
                <Sidebar
                    emitter={emitter}
                    buttonsState={buttonsState}
                    onButtonPressHandler={onButtonPressHandler}
                    onBlurHandler={onBlurHandler}
                />
                <Footer/>
            </>
        );
    }
}

export default App;