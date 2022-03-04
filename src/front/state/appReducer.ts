import {IObj} from "../../mid/misc/types";
import {actionsType, UPDATE_FILTER} from "./actions";

//types
export type buttonsType = {
    isPopulationLayer: boolean,
    isCoverNet: boolean,
    isAvailOnClick: boolean,
}
export type filterType = {
    affinityId: number,
    sportId: number,
    zonetypeId: number,
    name: string,
    org: string,
    sportzone: string,
}
export type appStateType = typeof initialState

const initialState = {
    objs: [] as unknown as Array<IObj>,
    filter: {
        affinityId: 0,
        sportId: 0,
        zonetypeId: 0,
        name: '',
        org: '',
        sportzone: '',
    } as filterType,
    buttonsValue: {
        isPopulationLayer: false,
        isAvailOnClick: false,
        isCoverNet: false,
    } as buttonsType,
}

export const appReducer = (state: appStateType = initialState, action: actionsType) => {
    switch(action.type) {
        case UPDATE_FILTER:
            const newFilter = action.payload.filter
            if (state.filter[Object.keys(newFilter)[0]] !== newFilter[Object.keys(newFilter)[0]]) {
                return {
                    ...state,
                    filter: {...state.filter, ...action.payload.filter}
                }
            } else return state
        default:
            return state
    }
}