import React from "react";
import styles from "./Header.module.scss"
import fitnessGroup from './fitnessGroup.png';

export const Header = React.memo(() => {
    return(
        <div className={styles.header}>
            <div className={styles.text}>mapsport</div>
            <div className={styles.img}><img src={fitnessGroup} alt="" /></div>
        </div>
    )
})