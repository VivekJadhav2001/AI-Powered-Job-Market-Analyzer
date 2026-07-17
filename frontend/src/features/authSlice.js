import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user:null,
    loading:false,
    error:false,
}


const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{

    }
})

export default authSlice.reducer