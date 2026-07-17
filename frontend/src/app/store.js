import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice.js"
import jobReducer from "../features/jobSlice.js"
const store = configureStore({
    reducer:{
        auth:authReducer,
        jobs: jobReducer
    }
})

export default store
