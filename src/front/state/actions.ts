//constants
import {filterType} from "./appReducer";

export const UPDATE_FILTER = 'UPDATE_FILTER'

export type actionsType = updateFilterActionType

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