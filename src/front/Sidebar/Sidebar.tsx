import React, {Dispatch, SetStateAction, useCallback, useState} from "react";
import styles from "./Sidebar.module.scss"
import {Select, Input} from 'antd';
import {
    spr_affinity,
    spr_sport,
    spr_zonetype,
} from '../mock/sprs';
import Group from '../Tilda_Icons_22_Sport/all_barbell.svg';
import fitnessGirl from './fitnessGirl.png';
import Line from './Line.png';
import {buttonsType, filterType} from "../../App";

const {Option} = Select;
const {Search} = Input;

type SideBarProps = {
    buttons: buttonsType,
    setButtons: Dispatch<SetStateAction<buttonsType>>,
    onChange: (state: any, doApply: boolean) => void,
    applyFilter: () => void,
    toggleIsPopulationLayer: () => void,
    isPopulationLayer: boolean
    toggleIsCoverNet: () => void,
    isCoverNet: boolean
    toggleIsAvailOnClick: () => void,
    isAvailOnClick: boolean,
    filter: filterType,
};

export const Sidebar: React.FC<SideBarProps> = React.memo(({
                                                               buttons,
                                                               setButtons,
                                                               onChange,
                                                               applyFilter,
                                                               toggleIsPopulationLayer,
                                                               isPopulationLayer,
                                                               toggleIsCoverNet,
                                                               isCoverNet,
                                                               toggleIsAvailOnClick,
                                                               isAvailOnClick,
                                                               filter
                                                           }) => {
    //state
    const [sideBarVisibility, setSideBarVisibility] = useState(true)

    //callbacks
    const toggleSideBar = useCallback(() => {
        setSideBarVisibility(!sideBarVisibility)
    }, [sideBarVisibility])
    const onBlurHandler = useCallback(() => {
        applyFilter()
    }, [applyFilter])
    const onChangeValues = useCallback((obj: Partial<filterType>) => {
        setButtons({...buttons, ...obj})
    }, [setButtons, buttons])

    //render
    return (
        <div className={sideBarVisibility ? `${styles.sidebar}` : `${styles.sidebar} ${styles.sidebarHidden}`}>
            <div className={styles.wrapper}>
                <div className={styles.mix}>
                    <div className={styles.text}>Название спортивного объекта</div>
                    <Search placeholder="Введите часть названия" allowClear style={{width: 300}}
                            onChange={
                                useCallback((event) => {
                                    let value = event.target.value;
                                    onChange({
                                        name: value
                                    }, false);
                                }, [onChange])
                            }
                            onBlur={onBlurHandler}
                    />
                </div>

                <div className={styles.mix}>
                    <div className={styles.text}>Ведомственная принадлежность</div>
                    <Search placeholder="Введите часть названия" allowClear style={{width: 300}}
                            onChange={
                                useCallback((event) => {
                                    let value = event.target.value;
                                    onChange({
                                        org: value
                                    }, false);
                                }, [onChange])
                            }
                            onBlur={onBlurHandler}
                    />
                </div>

                <div className={styles.mix}>
                    <div className={styles.text}>Наименование спортивных зон</div>
                    <Search placeholder="Введите часть названия" allowClear style={{width: 300}}
                            onChange={useCallback((event) => {
                                let value = event.target.value;
                                onChange({
                                    sportzone: value
                                }, false);
                            }, [onChange])
                            }
                            onBlur={onBlurHandler}
                    />
                </div>

                <div className={styles.mix}>
                    <div className={styles.text}>Тип спортивной зоны</div>
                    <Select
                        defaultValue="Все"
                        style={{width: 300}}
                        className={styles.select}
                        onChange={
                            useCallback((value) => {
                                value = +value as any;
                                onChange({
                                    zonetypeId: value
                                }, true);
                            }, [onChange])
                        }
                    >
                        <Option key={0} value={0}>Все</Option>
                        {Object.keys(spr_zonetype).map(key => {
                            return <Option key={key} value={key}>{
                                //@ts-ignore
                                spr_zonetype['33']
                            }</Option>
                        })}
                    </Select>
                </div>

                <div className={styles.mix}>
                    <div className={styles.text}>Вид спорта</div>
                    <Select
                        defaultValue="Все"
                        style={{width: 300}}
                        className={styles.select}
                        onChange={
                            useCallback((value) => {
                                value = +value as any;
                                onChange({
                                    sportId: value
                                }, true);
                            }, [onChange])
                        }
                    >
                        <Option key={0} value={0}>Все</Option>
                        {Object.keys(spr_sport).map((key) => <Option key={key} value={key}>
                            <img src={Group} alt="" className={styles.selectImg}/>{
                            //@ts-ignore
                            spr_sport[key]
                        }</Option>)}
                    </Select>
                </div>

                <div className={styles.mix}>
                    <div className={styles.text}>Доступность</div>
                    <Select
                        defaultValue="Все"
                        style={{width: 300}}
                        className={styles.select}
                        onChange={
                            useCallback((value) => {
                                value = +value as any;
                                onChange({
                                    affinityId: value
                                }, true);
                            }, [onChange])
                        }
                    >
                        <Option key={0} value={0}>Все</Option>
                        {Object.keys(spr_affinity).map(key => <Option key={key} value={key}>
                            <img src={Group} alt="" className={styles.selectImg}/>{
                            //@ts-ignore
                            spr_affinity[key]}</Option>)}
                    </Select>
                </div>

                <div className={styles.mix}>
                    <button onClick={() => {
                        //emitter.emit('clearCircles');
                    }}>Очистить круги доступности
                    </button>
                </div>

                <div className={styles.mix}>
                    <button onClick={toggleIsPopulationLayer}>
                        {isPopulationLayer ? 'Убрать' : 'Показать'} плотность населения
                    </button>
                </div>

                <div className={styles.mix}>
                    <button onClick={toggleIsCoverNet}>
                        {isCoverNet ? 'Убрать' : 'Наложить'} сетку охвата
                    </button>
                </div>

                <div className={styles.mix}>
                    <button onClick={toggleIsAvailOnClick}>
                        {isAvailOnClick ? "Отключить" : "Включить"} режим анализа по клику
                    </button>
                </div>

                <img src={fitnessGirl} alt="" className={styles.fitnessGirl}/>
            </div>
            <div onClick={toggleSideBar} className={styles.circle}>
                <img src={Line} alt={''} className={`${styles.line} ${!sideBarVisibility ? styles.show : ''}`}/>
                {/*{
                    !sideBarVisibility ? (
                        <img src={Line} alt="" className={`${styles.line} ${styles.show}`}/>
                    ) : (
                        <img src={Line} alt="" className={`${styles.line}`}/>
                    )
                }*/}
            </div>
        </div>
    )
})


