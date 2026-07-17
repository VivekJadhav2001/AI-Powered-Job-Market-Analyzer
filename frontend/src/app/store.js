import { configureStore } from "@reduxjs/toolkit"
import jobReducer from "../features/jobSlice.js"
import profileReducer from "../features/profileSlice.js"
const store = configureStore({
    reducer:{
        jobs: jobReducer,
        profile: profileReducer,
    }
})

export default store
