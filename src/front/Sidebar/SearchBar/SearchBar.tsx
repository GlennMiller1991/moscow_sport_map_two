import React, {ChangeEvent, useState} from "react";
import styles from "../Sidebar.module.scss";
import {Input} from 'antd';
import {filterType} from "../../state/appReducer";

const {Search} = Input;
export type searchBarPropsType = {
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