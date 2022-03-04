import EventEmitter from 'events';

import React, {useCallback, useState} from "react";
import styles from "./Sidebar.module.scss"

import {spr_affinity, spr_sport, spr_zonetype,} from '../mock/sprs';
import fitnessGirl from './fitnessGirl.png';
import Line from './Line.png';
import {Button} from "./Button/Button";
import {SearchSelect} from "./SearchSelect/SearchSelect";
import {SearchBar} from "./SearchBar/SearchBar";
import {useDispatch} from "react-redux";
import {updateButtons, updateFilter} from "../state/actions";
import {buttonsType, filterType} from "../state/appReducer";

interface SideBarProps {
    emitter: EventEmitter,
    buttonsState: buttonsType,
}

export const Sidebar: React.FC<SideBarProps> = ({
                                                    emitter,
                                                    buttonsState,
                                                }) => {
    //state
    const [sideBarVisibility, setSideBarVisibility] = useState(true)
    const dispatch = useDispatch()

    const onBlurHandlerC = useCallback((newFilter: Partial<filterType>) => {
        dispatch(updateFilter(newFilter))
    }, [])
    const onButtonPressHandler = useCallback((buttonsValue: Partial<buttonsType>) => {
        dispatch(updateButtons(buttonsValue))
    }, [])


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
                           onBlurHandler={onBlurHandlerC}
                           keyName={'name'}/>
                <SearchBar text={'Ведомственная принадлежность'}
                           onBlurHandler={onBlurHandlerC}
                           keyName={'org'}/>
                <SearchBar text={'Наименование спортивных зон'}
                           onBlurHandler={onBlurHandlerC}
                           keyName={'sportzone'}/>
                <SearchSelect text={'Тип спортивной зоны'}
                              keyName={'zonetypeId'}
                              onBlurHandler={onBlurHandlerC}
                              mocks={spr_zonetype}/>
                <SearchSelect text={'Вид спорта'}
                              keyName={'sportId'}
                              onBlurHandler={onBlurHandlerC}
                              mocks={spr_sport}/>
                <SearchSelect text={'Доступность'}
                              keyName={'affinityId'}
                              onBlurHandler={onBlurHandlerC}
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
                        text={'Показать плотность населения'}/>
                <Button onClick={onButtonPressHandler}
                        currentState={buttonsState.isCoverNet}
                        keyName={'isCoverNet'}
                        text={'Показать сетку охвата'}/>
                <Button onClick={onButtonPressHandler}
                        currentState={buttonsState.isAvailOnClick}
                        keyName={'isAvailOnClick'}
                        text={'Режим анализа по клику'}/>

                <img src={fitnessGirl} alt="" className={styles.fitnessGirl}/>
            </div>
            <div onClick={toggleSideBar} className={styles.circle}>
                <img src={Line} alt={''} className={`${styles.line} ${!sideBarVisibility ? styles.show : ''}`}/>
            </div>
        </div>
    )
}

