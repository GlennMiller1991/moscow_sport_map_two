import * as React from "react";
import {useCallback} from "react";
import EventEmitter from "events";
import {useSelector} from "react-redux";
import {stateType} from "../state/store";
import {buttonsType, filterType, isAppInitializedType} from "../state/appReducer";
import {IObj} from "../../mid/misc/types";
import {Header} from "../Header/Header";
import MapMain from "../MapMain";
import districts from "../mock/districts.json";
import Table from "../Table";
import {Sidebar} from "./Sidebar/Sidebar";
import {Footer} from "../Footer/Footer";
import {CreateSideBar} from "./CreateSideBar/CreateSideBar";

export const MainScreen: React.FC = React.memo(() => {
    console.log('from mainScreen')

    //state
    const emitter = new EventEmitter();
    const filter = useSelector<stateType, filterType>(state => state.appState.filter)
    const buttonsState = useSelector<stateType, buttonsType>(state => state.appState.buttonsValue)
    const objs = useSelector<stateType, Array<IObj>>(state => state.appState.objs)
    const isAppInitialized = useSelector<stateType, isAppInitializedType>(state => state.appState.isAppInitialized)

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
            {
                isAppInitialized === 'createObjects' ?
                    <CreateSideBar/>:
                    <Sidebar emitter={emitter}
                             buttonsState={buttonsState}
                    />
            }
            <Footer/>
        </>
    );
})