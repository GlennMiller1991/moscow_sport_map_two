import React, {useEffect} from 'react';
import styles from './LoginPage.module.scss';
import human from './fitness.png';
import vector from './Vector.png';
import vector2 from './Vector2.png';
import FadeIn from 'react-fade-in';
import {batch, useDispatch, useSelector} from "react-redux";
import {IObj} from "../../mid/misc/types";
import {registerFirstEntrance, updateInitializing, uploadObjects} from "../state/actions";
import {stateType} from "../state/store";
import {isAppInitializedType} from "../state/appReducer";

export const LoginPage: React.FC = React.memo(() => {

    const isAppInitialized = useSelector<stateType, isAppInitializedType>(state => state.appState.isAppInitialized)
    console.log(isAppInitialized)
    const dispatch = useDispatch()
    const onButtonPress = () => {
        dispatch(registerFirstEntrance())
    }

    useEffect(() => {
        let sprtObjsURL
        sprtObjsURL = 'https://gist.githubusercontent.com/GlennMiller1991/65dfa0423a1ba7f768377a4bff01307c/raw/2a9def9bd9c971a9f3f8983cf4b7d3265fac964d/sport_objects_offset_lat.json'
        // sprtObjsURL = 'https://gist.githubusercontent.com/GlennMiller1991/1a1b09b9dca08b896a077b7e13a3971a/raw/208f0722bbfab51bea46a77a992aa5255a1cf2a3/sport_objects.json',

            fetch(sprtObjsURL, {
            })
                .then<IObj[]>(response => response.json())
                .then(array => {
                    batch(() => {
                        dispatch(uploadObjects(array))
                        dispatch(updateInitializing("userObjects"))
                    })
                })
    }, [])
    return (
        <div className={styles.loginPage}>
            <div className={styles.content}>
                <FadeIn delay={100}>
                    <div className={styles.text}>
                        <h1>
                            <span>map</span>
                            <span style={{color: "#DDD"}}>sport</span>
                        </h1>
                    </div>
                    <div className={styles.btn}>
                        <button onClick={onButtonPress} disabled={isAppInitialized === 'none'}>Вход</button>
                    </div>
                </FadeIn>
            </div>
            <div className={styles.img}>
                <img src={human} alt="" className={styles.human}/>
                <img src={vector} alt="" className={styles.vector}/>
                <img src={vector2} alt="" className={styles.vector2}/>
            </div>
        </div>
    )
})