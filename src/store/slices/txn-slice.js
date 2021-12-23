import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    transaction: {
        isTransacting: false,
        txHash: undefined,
        transactionCompleted: false, 
        isError: false,
        errorMessage: undefined,
        type: undefined,
        message: undefined
    }
}

const transactionSlice = createSlice({
    name: "bondTransaction",
    initialState, 
    reducers: {
        transactionInitiated(state, {payload}) {
            const txnHash = payload.txnHash;
            state.transaction = {
                ...state.transaction,
                txnHash,
                isTransacting: true,
                type: payload.type,
            }
        },
        transactionSuccess(state) {
            state.transaction = {
                ...state.transaction,
                isTransacting: true,
                transactionCompleted: true, 
            }
        }, 
        transactionError(state, {payload}) {
            state.transaction = {
                ...state.transaction,
                isTransacting: true,
                isError: true, 
                type: payload.type
            }
        }, 
        transactionCompleted(state) {
            state.transaction = initialState
        }
    }
})

export const { transactionInitiated, transactionSuccess, transactionError, transactionCompleted } = transactionSlice.actions;

export default transactionSlice.reducer;