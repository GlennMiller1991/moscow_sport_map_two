import * as React from "react";
import {FormEvent, useCallback, useState} from "react";
import styles from "../Sidebar/Sidebar.module.scss";
import {spr_affinity, spr_sport, spr_zonetype} from "../../mock/sprs";
import fitnessGirl from "../Sidebar/fitnessGirl.png";
import Line from "../Sidebar/Line.png";
import {CreateField} from "./CreateField/CreateField";
import {CreateSelect} from "./CreateSelect/CreateSelect";

export const CreateSideBar: React.FC = () => {

    const [sideBarVisibility, setSideBarVisibility] = useState(true)
    const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    //callbacks
    const toggleSideBar = useCallback(() => {
        setSideBarVisibility(!sideBarVisibility)
    }, [sideBarVisibility])

    return (
        <div className={sideBarVisibility ? `${styles.sidebar}` : `${styles.sidebar} ${styles.sidebarHidden}`}>
            <div className={styles.wrapper}>
                <form onSubmit={onSubmitHandler}>
                    <CreateField text={'Широта'}
                                 keyName={'latitude'}
                                 placeholder={'Введите значение'}/>
                    <CreateField text={'Долгота'}
                                 keyName={'longitude'}
                                 placeholder={'Введите значение'}/>
                    <CreateField text={'Название спортивного объекта'}
                                 keyName={'name'}
                                 placeholder={'Введите название объекта'}/>
                    <CreateField text={'Ведомственная принадлежность'}
                                 keyName={'org'}
                                 placeholder={'Введите название ведомтсва'}/>
                    <CreateField text={'Наименование спортивной зоны'}
                                 keyName={'sportzone'}
                                 placeholder={'Введите название спортивной зоны'}/>
                    <CreateSelect text={'Тип спортивной зоны'}
                                  keyName={'zonetypeId'}
                                  mocks={spr_zonetype}/>
                    <CreateSelect text={'Вид спорта'}
                                  keyName={'sportId'}
                                  mocks={spr_sport}/>
                    <CreateSelect text={'Доступность'}
                                  keyName={'affinityId'}
                                  mocks={spr_affinity}/>
                    <div className={styles.mix}>
                        <button type={'submit'} className={styles.submit}>
                            Добавить объект
                        </button>
                    </div>
                </form>
                <img src={fitnessGirl} alt="" className={styles.fitnessGirl}/>
            </div>
            <div onClick={toggleSideBar} className={styles.circle}>
                <img src={Line} alt={''} className={`${styles.line} ${!sideBarVisibility ? styles.show : ''}`}/>
            </div>
        </div>
    )
}