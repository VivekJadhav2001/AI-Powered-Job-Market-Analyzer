import { configureStore } from "@reduxjs/toolkit"
import jobReducer from "../features/jobSlice.js"
import profileReducer from "../features/profileSlice.js"
import dashboardReducer from "../features/dashboardSlice.js"
import aiMatchReducer from "../features/aiMatchSlice.js"

const store = configureStore({
    reducer:{
        jobs: jobReducer,
        profile: profileReducer,
        dashboard:dashboardReducer,
        aiMatches: aiMatchReducer
    }
})

export default store
