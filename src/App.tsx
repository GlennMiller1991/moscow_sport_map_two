import React, {useCallback, useState} from 'react';
import './App.css';
import {LoginPage} from "./front/LoginPage/LoginPage";
import {Header} from "./front/Header/Header";
import {Footer} from "./front/Footer/Footer";
import {Sidebar} from "./front/Sidebar/Sidebar";
import {IObj} from "./mid/misc/types";

export type filterType = {
    affinityId: number,
    sportId: number,
    zonetypeId: number,
    name: string,
    org: string,
    sportzone: string,
}

export type buttonsType = {
    isPopulationLayer: boolean,
    isCoverNet: boolean,
    isAvailOnClick: boolean,
}

function App() {
    //state
    const [isEntranceRemoved, setIsEntranceRemoved] = useState(false)
    const [objs, setObjs] = useState<IObj[]>([])
    const [buttons, setButtons] = useState<buttonsType>({
        isAvailOnClick: false,
        isCoverNet: false,
        isPopulationLayer: false
    })
    const [filter, setFilter] = useState<filterType>({
        affinityId: 0,
        sportId: 0,
        zonetypeId: 0,
        name: '',
        org: '',
        sportzone: ''
    })

    //callbacks
    const applyFilter = useCallback((objs: IObj[], filter: filterType) => {
        let newObjs = objs.filter(obj => {
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

        setObjs(newObjs)
    }, [])
    const onEnterClick = useCallback(() => {
        setIsEntranceRemoved(true)
    }, [])
    const onChangeSidebarValue = useCallback((userFilter: filterType, doApply: boolean) => {
        let totalFilter = {...filter, ...userFilter};
        setFilter(totalFilter)
        if (doApply) {
            applyFilter(objs, totalFilter);
        }
    }, [filter])

    //render
    if (!isEntranceRemoved) {
        return (
            <LoginPage callback={onEnterClick}/>
        )
    } else {
        return (
            <React.Fragment>
                <Header/>
                <div className="mapContainer">
                    {/*<MapMain
                        objs={this.state.objs}
                        emitter={this.emitter}
                        isPopulationLayer={this.state.isPopulationLayer}
                        isCoverNet={this.state.isCoverNet}
                        isAvailOnClick={this.state.isAvailOnClick}
                        districts={districts as any}
                        sportId={this.state.filter.sportId}
                    />*/}
                </div>
                <div style={{clear: 'both'}}/>
                <div className="analytics"/>
                <Sidebar
                    buttons={buttons}
                    setButtons={setButtons}
                    onChange={onChangeSidebarValue}
                    isPopulationLayer={buttons.isPopulationLayer}
                    toggleIsPopulationLayer={() => {
                        /*this.setState((state) => {
                            return {isPopulationLayer: !state.isPopulationLayer}
                        })*/
                    }}
                    isCoverNet={buttons.isCoverNet}
                    toggleIsCoverNet={() => {
                        /*this.setState((state) => {
                            return {isCoverNet: !state.isCoverNet}
                        })*/
                    }}
                    isAvailOnClick={buttons.isAvailOnClick}
                    toggleIsAvailOnClick={() => {
                        /*this.setState((state) => {
                            return {isAvailOnClick: !state.isAvailOnClick}
                        })*/
                    }}
                    applyFilter={() => {}/*this.applyFilter.bind(this)*/}
                    filter={filter}
                />
                <Footer/>
            </React.Fragment>
        );
    }
}

export default App;
