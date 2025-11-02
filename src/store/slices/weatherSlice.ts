import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import LOCATIONS from '../../utils/constants/locations';
import type { WeatherResponse } from '../../types';

interface IWeatherState {
	data: Record<string, WeatherResponse>;
	loading: boolean;
	error: string | null;
}

export const fetchWeatherData = createAsyncThunk<
	Record<string, WeatherResponse>,
	void,
	{ rejectValue: string }
>(
	'weather/fetchData',
	async (_, { rejectWithValue }) => {
		try {
			const requests = LOCATIONS.map((location) =>
				axios.get<WeatherResponse>('https://api.open-meteo.com/v1/forecast', {
					params: {
						latitude: location.lat,
						longitude: location.lon,
						hourly: 'temperature_2m',
						timezone: location.timezone,
						past_days: 7,    // Данные за последние 7 дней
						forecast_days: 0,
					},
				})
			);

			const responses = await Promise.all(requests);


			const result: Record<string, WeatherResponse> = {};

			responses.forEach((res, i) => {
				result[LOCATIONS[i].name] = res.data;
				console.log(`Data for ${LOCATIONS[i].name}:`, {
					timePoints: res.data.hourly.time.length,
					temperatures: res.data.hourly.temperature_2m.length,
					firstTime: res.data.hourly.time[0],
					lastTime: res.data.hourly.time[res.data.hourly.time.length - 1]
				});
			});

			return result;
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				return rejectWithValue(err.response?.data?.reason || err.message || 'Ошибка сети');
			}
			return rejectWithValue('Неизвестная ошибка');
		}
	}
);



const initialState: IWeatherState = {
	data: {},
	loading: true,
	error: null,
};

const weatherSlice = createSlice({
	name: 'weather',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchWeatherData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchWeatherData.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
			})
			.addCase(fetchWeatherData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || 'Не удалось загрузить данные';
			});
	},
});

export const { clearError } = weatherSlice.actions;

export default weatherSlice.reducer;