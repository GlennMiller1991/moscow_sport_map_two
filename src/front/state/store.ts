import {combineReducers, createStore} from "redux";
import {appReducer} from "./appReducer";

const rootReducer = combineReducers({
    appState: appReducer,
})

export const store = createStore(rootReducer)
export type stateType = ReturnType<typeof store.getState>
export type dispatchType = typeof store.dispatch

//@ts-ignore
window.store = store