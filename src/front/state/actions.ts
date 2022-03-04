//constants
import {buttonsType, filterType, isAppInitializedType} from "./appReducer";
import {IObj} from "../../mid/misc/types";

export const UPDATE_FILTER = 'UPDATE_FILTER'
export const UPLOAD_OBJECTS = 'UPLOAD_OBJECTS'
export const REGISTER_FIRST_ENTRANCE = 'REGISTER_FIRST_ENTRANCE'
export const UPDATE_BUTTONS = 'UPDATE_BUTTONS'
export const UPDATE_INITIALIZING = 'UPDATE_INITIALIZING'

export type actionsType =
    updateFilterActionType |
    updateButtonsActionType |
    updateInitializingActionType |
    uploadObjectsActionType |
    registerFirstEntranceActionType

//actions
type updateFilterActionType = ReturnType<typeof updateFilter>
export const updateFilter = (filter: Partial<filterType>) => {
    return {
        type: UPDATE_FILTER,
        payload: {
            filter
        }
    } as const
}

type uploadObjectsActionType = ReturnType<typeof uploadObjects>
export const uploadObjects = (objs: Array<IObj>) => {
    return {
        type: UPLOAD_OBJECTS,
        payload: {
            objs,
        }
    } as const
}

type registerFirstEntranceActionType = ReturnType<typeof registerFirstEntrance>
export const registerFirstEntrance = (isEntranceRemoved = true) => {
    return {
        type: REGISTER_FIRST_ENTRANCE,
        payload: {
            isEntranceRemoved,
        }
    } as const
}

type updateButtonsActionType = ReturnType<typeof updateButtons>
export const updateButtons = (buttons: Partial<buttonsType>) => {
    return {
        type: UPDATE_BUTTONS,
        payload: {
            buttons,
        }
    } as const
}

type updateInitializingActionType = ReturnType<typeof updateInitializing>
export const updateInitializing = (isAppInitialized: isAppInitializedType) => {
    return {
        type: UPDATE_INITIALIZING,
        payload: {
            isAppInitialized,
        }
    } as const
}