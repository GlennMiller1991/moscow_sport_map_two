import React, {ChangeEvent, useState} from "react";
import styles from "../../Sidebar/Sidebar.module.scss";
import {Input} from 'antd';
import {filterType} from "../../../state/appReducer";

export type CreateFieldPropsType = {
    onChange?: (state: any, doApply: boolean) => void,
    text: string,
    onBlurHandler?: (obj: Partial<filterType>) => void,
    keyName: string,
    mocks?: any,
    placeholder: string
}

export const CreateField: React.FC<CreateFieldPropsType> = React.memo((props) => {
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
            <Input placeholder={props.placeholder} allowClear style={{width: 300}}
                   onChange={onChangeHandler}
                   onBlur={onBlurHandler}
            />
        </div>
    )
})