import EventEmitter from 'events';

import React, {ChangeEvent, useCallback, useState} from "react";
import styles from "./Sidebar.module.scss"

import {Select, Input} from 'antd';

const {Option} = Select;
const {Search} = Input;

import {
    spr_affinity,
    spr_sport,
    spr_zonetype,
} from '../mock/sprs';

import Group from '../Tilda_Icons_22_Sport/all_barbell.svg';
import fitnessGirl from './fitnessGirl.png';
import Line from './Line.png';
import {filterType, IFilter} from "../App";

interface SideBarProps {
    onBlurHandler: (obj: Partial<filterType>) => void,
    filter: IFilter,
    emitter: EventEmitter,
    toggleIsPopulationLayer: () => void,
    isPopulationLayer: boolean
    toggleIsCoverNet: () => void,
    isCoverNet: boolean
    toggleIsAvailOnClick: () => void,
    isAvailOnClick: boolean
}

export const Sidebar: React.FC<SideBarProps> = React.memo(({
                                                               onBlurHandler,
                                                               emitter,
                                                               toggleIsPopulationLayer,
                                                               isPopulationLayer,
                                                               toggleIsCoverNet,
                                                               isCoverNet,
                                                               toggleIsAvailOnClick,
                                                               isAvailOnClick,
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
                    <button onClick={() => {
                        emitter.emit('clearCircles');
                    }}>Очистить круги доступности
                    </button>
                </div>

                <div className={styles.mix}>
                    <button onClick={() => {
                        toggleIsPopulationLayer();
                    }}>{isPopulationLayer ? 'Убрать' : 'Показать'} плотность населения
                    </button>
                </div>

                <div className={styles.mix}>
                    <button onClick={() => {
                        toggleIsCoverNet();
                    }}>{isCoverNet ? 'Убрать' : 'Наложить'} сетку охвата
                    </button>
                </div>

                <div className={styles.mix}>
                    <button onClick={() => {
                        toggleIsAvailOnClick();
                    }}>{isAvailOnClick ? "Отключить" : "Включить"} режим анализа по клику
                    </button>
                </div>

                <img src={fitnessGirl} alt="" className={styles.fitnessGirl}/>
            </div>
            <div onClick={toggleSideBar} className={styles.circle}>
                <img src={Line} alt={''} className={`${styles.line} ${!sideBarVisibility ? styles.show : ''}`}/>
            </div>
        </div>
    )

})

type searchBarPropsType = {
    onChange?: (state: any, doApply: boolean) => void,
    text: string,
    onBlurHandler?: (obj: Partial<filterType>) => void,
    keyName: string,
    mocks?: any,
}
export const SearchBar: React.FC<searchBarPropsType> = React.memo((props) => {
    console.log(`from searchBar ${props.text}`)

    //state
    const [value, setValue] = useState('')

    //callbacks
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.currentTarget.value;
        setValue(value)
    }
    const onBlurHandler = () => {
        props.onBlurHandler && props.onBlurHandler({[props.keyName]: value})
    }

    return (
        <div className={styles.mix}>
            <div className={styles.text}>{props.text}</div>
            <Search placeholder={'Введите часть названия'} allowClear style={{width: 300}}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
            />
        </div>
    )
})

export const SearchSelect: React.FC<searchBarPropsType> = React.memo((props) => {
    const onBlurHandler = (value: any) => {
        props.onBlurHandler && props.onBlurHandler({[props.keyName]: value})
    }

    return (
        <div className={styles.mix}>
            <div className={styles.text}>{props.text}</div>
            <Select
                defaultValue="Все"
                style={{width: 300}}
                className={styles.select}
                onChange={(value) => {
                    let nValue = +value as any;
                    onBlurHandler(nValue)
                }}
            >
                <Option key={0} value={0}>Все</Option>
                {Object.keys(props.mocks).map(key => <Option key={key}
                                                             value={key}>{spr_zonetype[key]}</Option>)}
            </Select>
        </div>
    )
})
