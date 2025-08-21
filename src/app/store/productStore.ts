import { configureStore } from "@reduxjs/toolkit";
import { fetchData } from "../service/dummyData";
import { setupListeners } from "@reduxjs/toolkit/query";

export const productStore = configureStore({
    reducer: {
        [fetchData.reducerPath]: fetchData.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat([fetchData.middleware])
})

setupListeners(
    productStore.dispatch
)