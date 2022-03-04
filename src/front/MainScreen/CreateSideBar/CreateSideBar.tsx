import * as React from "react";
import {useCallback, useState} from "react";
import styles from "../Sidebar/Sidebar.module.scss";
import {SearchBar} from "../Sidebar/SearchBar/SearchBar";
import {SearchSelect} from "../Sidebar/SearchSelect/SearchSelect";
import {spr_affinity, spr_sport, spr_zonetype} from "../../mock/sprs";
import fitnessGirl from "../Sidebar/fitnessGirl.png";
import Line from "../Sidebar/Line.png";

export const CreateSideBar: React.FC = () => {

    const [sideBarVisibility, setSideBarVisibility] = useState(true)


    //callbacks
    const toggleSideBar = useCallback(() => {
        setSideBarVisibility(!sideBarVisibility)
    }, [sideBarVisibility])

    return (
        <div
            className={sideBarVisibility ? `${styles.sidebar}` : `${styles.sidebar} ${styles.sidebarHidden}`}>
            <div className={styles.wrapper}>
                <SearchBar text={'Широта'}
                           keyName={'latitude'}
                           placeholder={'Введите значение'}/>
                <SearchBar text={'Долгота'}
                           keyName={'longitude'}
                           placeholder={'Введите значение'}/>
                <SearchBar text={'Название спортивного объекта'}
                           keyName={'name'}
                           placeholder={'Введите название объекта'}/>
                <SearchBar text={'Ведомственная принадлежность'}
                           keyName={'org'}
                           placeholder={'Введите название ведомтсва'}/>
                <SearchBar text={'Наименование спортивной зоны'}
                           keyName={'sportzone'}
                           placeholder={'Введите название спортивной зоны'}/>
                <SearchSelect text={'Тип спортивной зоны'}
                              keyName={'zonetypeId'}
                              mocks={spr_zonetype}/>
                <SearchSelect text={'Вид спорта'}
                              keyName={'sportId'}
                              mocks={spr_sport}/>
                <SearchSelect text={'Доступность'}
                              keyName={'affinityId'}
                              mocks={spr_affinity}/>

                <img src={fitnessGirl} alt="" className={styles.fitnessGirl}/>
            </div>
            <div onClick={toggleSideBar} className={styles.circle}>
                <img src={Line} alt={''} className={`${styles.line} ${!sideBarVisibility ? styles.show : ''}`}/>
            </div>
        </div>
    )
}