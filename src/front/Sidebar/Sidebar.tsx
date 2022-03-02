import EventEmitter from 'events';

import React, {useCallback, useState} from "react";
import styles from "./Sidebar.module.scss"

import {spr_affinity, spr_sport, spr_zonetype,} from '../mock/sprs';
import fitnessGirl from './fitnessGirl.png';
import Line from './Line.png';
import {buttonsType, filterType} from "../App";
import {Button} from "./Button/Button";
import {SearchSelect} from "./SearchSelect/SearchSelect";
import {SearchBar} from "./SearchBar/SearchBar";

interface SideBarProps {
    onBlurHandler: (obj: Partial<filterType>) => void,
    emitter: EventEmitter,
    buttonsState: buttonsType,
    onButtonPressHandler: (obj: Partial<buttonsType>) => void,
}

export const Sidebar: React.FC<SideBarProps> = ({
                                                               onBlurHandler,
                                                               onButtonPressHandler,
                                                               emitter,
                                                               buttonsState,
                                                           }) => {
    //state
    const [sideBarVisibility, setSideBarVisibility] = useState(true)

    //callbacks
    const toggleSideBar = useCallback(() => {
        setSideBarVisibility(!sideBarVisibility)
    }, [sideBarVisibility])
    console.log('from sidebar')
    return (
        <div
            className={sideBarVisibility ? `${styles.sidebar}` : `${styles.sidebar} ${styles.sidebarHidden}`}>
            <div className={styles.wrapper}>
                <SearchBar text={'Название спортивного объекта'}
                           onBlurHandler={onBlurHandler}
                           keyName={'name'}/>
                <SearchBar text={'Ведомственная принадлежность'}
                           onBlurHandler={onBlurHandler}
                           keyName={'org'}/>
                <SearchBar text={'Наименование спортивных зон'}
                           onBlurHandler={onBlurHandler}
                           keyName={'sportzone'}/>
                <SearchSelect text={'Тип спортивной зоны'}
                              keyName={'zonetypeId'}
                              onBlurHandler={onBlurHandler}
                              mocks={spr_zonetype}/>
                <SearchSelect text={'Вид спорта'}
                              keyName={'sportId'}
                              onBlurHandler={onBlurHandler}
                              mocks={spr_sport}/>
                <SearchSelect text={'Доступность'}
                              keyName={'affinityId'}
                              onBlurHandler={onBlurHandler}
                              mocks={spr_affinity}/>

                <div className={styles.mix}>
                    <button onClick={useCallback(() => {
                        emitter.emit('clearCircles');
                    }, [])}>Очистить круги доступности
                    </button>
                </div>

                <Button onClick={onButtonPressHandler}
                        currentState={buttonsState.isPopulationLayer}
                        keyName={'isPopulationLayer'}
                        text={'плотность населения'}/>
                <Button onClick={onButtonPressHandler}
                        currentState={buttonsState.isCoverNet}
                        keyName={'isCoverNet'}
                        text={'сетку охвата'}/>
                <Button onClick={onButtonPressHandler}
                        currentState={buttonsState.isAvailOnClick}
                        keyName={'isAvailOnClick'}
                        text={'режим анализа по клику'}/>

                <img src={fitnessGirl} alt="" className={styles.fitnessGirl}/>
            </div>
            <div onClick={toggleSideBar} className={styles.circle}>
                <img src={Line} alt={''} className={`${styles.line} ${!sideBarVisibility ? styles.show : ''}`}/>
            </div>
        </div>
    )
}

