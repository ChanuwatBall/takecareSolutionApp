import { createSlice, type PayloadAction  } from '@reduxjs/toolkit' 
import type { RootState } from './store'
// Define a type for the slice state
export interface CounterState {
  value: number
  loading: boolean
}

// Define the initial state using that type
const initialState: CounterState = {
  value: 0 ,
  loading:true
}

export const appSlice = createSlice({
  name: 'appstate',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    setLoaing:(state , action) =>{
        state.loading = action.payload
        // if(!state.loading){
        //     setTimeout(()=>{ state.loading = false},2000)
        // }
    } 
  }
})

export const { increment, decrement, incrementByAmount ,setLoaing } = appSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.appstate.value
export const getLoading = (state: RootState) => state.appstate.loading

export default appSlice.reducer