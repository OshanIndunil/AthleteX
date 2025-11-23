import { configureStore, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Authentication Slice (For User Login) 
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    loginSuccess: (state, action) => {
      // Update state
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      // Save to storage safely
      if (action.payload.token) {
        AsyncStorage.setItem('userToken', action.payload.token).catch(err => console.log(err));
      }
      if (action.payload.user) {
        AsyncStorage.setItem('userData', JSON.stringify(action.payload.user)).catch(err => console.log(err));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('userToken');
      AsyncStorage.removeItem('userData');
    },
  },
});

//Favorites Slice (For Saving Sports Teams) 
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [] },
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const existingIndex = state.items.findIndex((i) => i.idTeam === item.idTeam);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1); 
      } else {
        state.items.push(item); 
      }
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export const { toggleFavorite } = favoritesSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    favorites: favoritesSlice.reducer,
  },
});