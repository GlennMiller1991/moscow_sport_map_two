import {IObj} from "../../mid/misc/types";
import {
    actionsType,
    REGISTER_FIRST_ENTRANCE,
    UPDATE_BUTTONS,
    UPDATE_FILTER,
    UPDATE_INITIALIZING,
    UPLOAD_OBJECTS
} from "./actions";

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

export type isAppInitializedType = 'none' | 'userObjects' | 'demo' | 'createObjects'

const initialState = {
    isAppInitialized: 'none' as isAppInitializedType,
    isEntranceRemoved: false as boolean,
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
        case UPDATE_BUTTONS:
            const obj = action.payload.buttons
            let resButtons = {...state.buttonsValue, ...obj}
            const key = Object.keys(obj)[0]
            if (obj[key]) {
                if (key === 'isPopulationLayer') {
                    resButtons['isCoverNet'] = false
                } else if (key === 'isCoverNet') {
                    resButtons['isPopulationLayer'] = false
                }
            }
            return {
                ...state,
                buttonsValue: {
                    ...resButtons,
                }
            }
        case UPDATE_FILTER:
            const newFilter = action.payload.filter
            if (state.filter[Object.keys(newFilter)[0]] !== newFilter[Object.keys(newFilter)[0]]) {
                return {
                    ...state,
                    filter: {...state.filter, ...action.payload.filter}
                }
            } else return state
        case UPLOAD_OBJECTS:
        case UPDATE_INITIALIZING:
        case REGISTER_FIRST_ENTRANCE:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state
    }
}