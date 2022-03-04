import * as React from 'react';
import EventEmitter from 'events';
import MapMain from './MapMain';
import {IObj} from '../mid/misc/types';
import sprtObjs from './mock/sport_objects.json';
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
    const emitter = new EventEmitter();

    //state
    const [isEntranceRemoved, setIsEntranceRemoved] = useState(false)
    const [objs, setObjs] = useState<IObj[]>(sprtObjs as unknown as IObj[])
    const filter = useSelector<stateType, filterType>(state => state.appState.filter)

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
                />
                <Footer/>
            </>
        );
    }
}

export default App;