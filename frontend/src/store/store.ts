import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../slice/userSlice'


const loadUserData = () => {
    const serializedUserData = localStorage.getItem('userData');
    return serializedUserData ? JSON.parse(serializedUserData) : null;
  };

export const store = configureStore({
    reducer: {
       user:userReducer
    },
    preloadedState: {
        user: {
            user: loadUserData(), 
        },
    },
  })

  export type RootState = ReturnType<typeof store.getState>
   export type AppDispatch = typeof store.dispatch