import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import {
	useDispatch,
	useSelector,
	type TypedUseSelectorHook
} from 'react-redux';

export const store = configureStore({
	reducer: {
		weather: weatherReducer,
	},
	// Middleware по умолчанию для devTools
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST'],
			},
		}),
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Типизированные хуки для использования в компонентах
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
