import React from "react";
import styles from "../Sidebar.module.scss";
import {buttonsType} from "../../../state/appReducer";

type ButtonPropsType = {
    onClick: (obj: Partial<buttonsType>) => void,
    currentState: boolean,
    keyName: string,
    text: string,
}
export const Button: React.FC<ButtonPropsType> = React.memo((props) => {
    return (
        <div className={styles.mix}>
            <button onClick={() => {
                props.onClick({[props.keyName]: !props.currentState});
            }} style={props.currentState ? {backgroundColor: 'rgba(128,243,70,0.5)'} : {}}>
                {props.text}
            </button>
        </div>
    )
})