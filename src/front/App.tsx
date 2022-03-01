import * as React from 'react';
// const DG = require('2gis-maps');
import EventEmitter from 'events';

import MapMain from './MapMain';
import {getInterjacentColorStr, IObj, IRGBA} from '../mid/misc/types';

import objs from './mock/sport_objects.json';
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

interface IAppProps {
}

interface IAppState {
    isEntranceRemoved?: boolean,
    objs: IObj[],
    filter: IFilter,
    isPopulationLayer?: boolean,
    isCoverNet?: boolean,
    isAvailOnClick?: boolean,
    isOnlyOldRegions?: boolean
}

function App() {
    console.log('from function component')
    const emitter = new EventEmitter;

    //state
    const [isEntranceRemoved, setIsEntranceRemoved] = useState(false)
    const [objs, setObjs] = useState<IObj[]>([])
    const [filter, setFilter] = useState<filterType>({
        affinityId: 0,
        sportId: 0,
        zonetypeId: 0,
        name: '',
        org: '',
        sportzone: '',
    })
    const [isPopulationLayer, setIsPopulationLayer] = useState(false)
    const [isCoverNet, setIsCoverNet] = useState(false)
    const [isAvailOnClick, setIsAvailOnClick] = useState(false)

    //callbacks
    const onBlurHandler = useCallback((obj: Partial<filterType>) => {
        console.log(filter[Object.keys(obj)[0]], obj[Object.keys(obj)[0]], Object.keys(obj), obj, filter)
        if (filter[Object.keys(obj)[0]] !== obj[Object.keys(obj)[0]]) {
            setFilter({...filter, ...obj})
        }
    }, [filter])
    const applyFilter = useCallback((objs: IObj[], filter: filterType) => {
        console.log('from applyFilter')
        return objs.filter(obj => {
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
                    return part.sportzonetypeId === filter.zonetypeId;
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
                        isPopulationLayer={isPopulationLayer}
                        isCoverNet={isCoverNet}
                        isAvailOnClick={isAvailOnClick}
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
                    isPopulationLayer={isPopulationLayer}
                    toggleIsPopulationLayer={() => {
                        /*this.setState((state) => {
                            return {isPopulationLayer: !state.isPopulationLayer}
                        })*/
                    }}
                    isCoverNet={isCoverNet}
                    toggleIsCoverNet={() => {
                        /*this.setState((state) => {
                            return {isCoverNet: !state.isCoverNet}
                        })*/
                    }}
                    isAvailOnClick={isAvailOnClick}
                    toggleIsAvailOnClick={() => {
                        /*this.setState((state) => {
                            return {isAvailOnClick: !state.isAvailOnClick}
                        })*/
                    }}
                    onBlurHandler={onBlurHandler}
                    filter={filter}
                />
                <Footer/>

                {/*
                    <div className="info">
                        <div style={{ width: 200, float: 'left' }}>
                            <div>Диапазоны площади объектов, кв.м.</div>
                            {Array(15).fill(0).map((v, i) => {
                                const rgb1 = [255, 0, 0, 1] as IRGBA;
                                const rgb2 = [0, 255, 0, 1] as IRGBA;

                                let rgbStr = getInterjacentColorStr(i, 15, rgb1, rgb2);

                                return (<React.Fragment key={i}>
                                    <div>
                                        <div style={{ width: 30, height: 20, backgroundColor: rgbStr, float: 'left' }}></div>
                                        <div style={{ float: 'left', paddingLeft: 5 }}>{2 ** i - 1}{(i < 14) ? (<>&ndash;{2 ** (i + 1) - 1}</>) : <>+</>}</div>
                                    </div>
                                    <div style={{ clear: 'both' }}></div>
                                </React.Fragment>);
                            })}
                        </div>
                        <div style={{ width: 200, float: 'left' }}>
                            <div>Диапазоны плотности населения</div>
                            {Array(20).fill(0).filter((v, i) => i % 2).map((v, i) => {
                                const rgb1 = [0, 0, 255, 1] as IRGBA;
                                const rgb2 = [255, 0, 0, 1] as IRGBA;

                                let rgbStr = getInterjacentColorStr(i, 9, rgb1, rgb2);
                                return (
                                    <React.Fragment key={i}>
                                        <div>
                                            <div style={{ width: 30, height: 20, backgroundColor: rgbStr, float: 'left' }}></div>
                                            <div style={{ float: 'left', paddingLeft: 5 }}>{i * 10}{(i < 9) ? (<>&ndash;{(i + 1) * 10}</>) : <>+</>}</div>
                                        </div>
                                        <div style={{ clear: 'both' }}></div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div> */}
            </>
        );
    }
}

export default App;