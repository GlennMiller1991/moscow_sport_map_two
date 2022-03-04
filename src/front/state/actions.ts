//constants
import {filterType} from "./appReducer";
import {IObj} from "../../mid/misc/types";

export const UPDATE_FILTER = 'UPDATE_FILTER'
export const UPLOAD_OBJECTS = 'UPLOAD_OBJECTS'

export type actionsType =
    updateFilterActionType |
    uploadObjectsActionType

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