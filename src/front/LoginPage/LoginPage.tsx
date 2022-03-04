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
        const search = window.location.search
        const params = new URLSearchParams(search)
        let url = params.get('path')

        if (url) {
            if (url === 'demo') {
                batch(() => {
                    dispatch(updateInitializing('demo'))
                })

            } else {
                url = 'https://gist.githubusercontent.com/' + url
                fetch(url, {})
                    .then<IObj[]>(response => response.json())
                    .then(array => {
                        batch(() => {
                            dispatch(uploadObjects(array))
                            dispatch(updateInitializing("userObjects"))
                        })
                    })
                    .catch(err => {
                        console.log('Could not download data')
                        dispatch(updateInitializing('demo'))
                    })
            }
        } else {
            dispatch(updateInitializing('demo'))
        }
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