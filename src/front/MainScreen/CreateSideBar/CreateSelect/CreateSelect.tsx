import React from "react";
import styles from "../../Sidebar/Sidebar.module.scss";
import {Select} from "antd";
import {filterType} from "../../../state/appReducer";


type CreateSelectPropsType = {
    onChange?: (state: any, doApply: boolean) => void,
    text: string,
    onBlurHandler?: (obj: Partial<filterType>) => void,
    keyName: string,
    mocks?: any,
}
const {Option} = Select;
export const CreateSelect: React.FC<CreateSelectPropsType> = React.memo((props) => {
    const onBlurHandler = (value: any) => {
        props.onBlurHandler && props.onBlurHandler({[props.keyName]: value})
    }

    return (
        <div className={styles.mix}>
            <div className={styles.text}>{props.text}</div>
            <Select style={{width: 300}}
                    placeholder={'Выберите из списка'}
                    className={styles.select}
                    onChange={(value) => {
                        let nValue = +value as any;
                        onBlurHandler(nValue)
                    }}>
                {
                    Object.keys(props.mocks).map(key => {
                        return (
                            <Option key={key}
                                    value={key}>{props.mocks[key]}
                            </Option>
                        )
                    })
                }
            </Select>
        </div>
    )
})