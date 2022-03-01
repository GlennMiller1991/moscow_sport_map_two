import React from "react";
import styles from "../Sidebar.module.scss";
import {Select} from "antd";
import {spr_zonetype} from "../../mock/sprs";
import {searchBarPropsType} from "../SearchBar/SearchBar";


const {Option} = Select;
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