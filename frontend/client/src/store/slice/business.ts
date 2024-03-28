import {BusinessGeneration, BusinessGenerationUpdatePayload} from "@/types/business.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface BusinessState {
  list: BusinessGeneration[]
}

const initialState: BusinessState = {
  list: []
}

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    addQueries: (state, action: PayloadAction<BusinessGeneration[]>) => {
      state.list = action.payload
    },

    addQuery: (state, action: PayloadAction<BusinessGeneration>) => {
      state.list.push(action.payload)
    },

    updatePlanStatus: (state, action: PayloadAction<BusinessGenerationUpdatePayload>) => {
      state.list = state.list.map((plan => {
        if (plan.id === action.payload.id) {
          return {
            ...plan,
            isGenerated: action.payload.is_generated !== undefined && action.payload.is_generated,
            isGenerating: action.payload.is_generating !== undefined && action.payload.is_generating,
            isQueued: action.payload.is_queued !== undefined && action.payload.is_queued
          }
        }

        return plan
      }))
    }
  }
})

export const {addQuery, updatePlanStatus, addQueries} = businessSlice.actions
export default businessSlice.reducer
