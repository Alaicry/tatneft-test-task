import { useEffect, useState } from "react";
import type { TimeRange } from "../types";
import DEFAULT_TIME_RANGE from "../utils/constants/defaultTimeRange";

interface IWeatherSettings {
	timeRange: TimeRange;
}

export const useLocalStorage = () => {
	const [settings, setSettings] = useState<IWeatherSettings>(() => {

		const saved = localStorage.getItem('weather-settings');
		if (saved) {
			try {
				const parsedSettings = JSON.parse(saved);

				if (parsedSettings && typeof parsedSettings === 'object' && 'timeRange' in parsedSettings) {
					return parsedSettings;
				} else {
					console.warn('Некорректная структура данных в localStorage, используются значения по умолчанию');
				}
			} catch (error) {
				console.error('Ошибка при парсинге данных из localStorage:', error);

				localStorage.removeItem('weather-settings');
			}
		}

		try {
			const urlParams = new URLSearchParams(window.location.search);

			const urlTimeRange = urlParams.get('timeRange') as TimeRange;

			const isValidTimeRange = urlTimeRange && ['6h', '24h', '7d'].includes(urlTimeRange);

			return {
				timeRange: isValidTimeRange ? urlTimeRange : DEFAULT_TIME_RANGE,
			};
		} catch (error) {

			console.error('Ошибка при чтении URL параметров:', error);

			return {
				timeRange: DEFAULT_TIME_RANGE,
			};
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem('weather-settings', JSON.stringify(settings));
		} catch (error) {

			console.error('Ошибка при сохранении в localStorage:', error);

			try {
				localStorage.removeItem('weather-settings');
			} catch (clearError) {
				console.error('Не удалось очистить localStorage:', clearError);
			}
		}
	}, [settings]);

	useEffect(() => {
		try {
			const url = new URL(window.location.href);

			url.searchParams.set('timeRange', settings.timeRange);

			window.history.replaceState({}, '', url.toString());
		} catch (error) {
			console.error('Ошибка при обновлении URL:', error);
		}
	}, [settings.timeRange]);


	const updateTimeRange = (timeRange: TimeRange) => {
		setSettings(prev => ({
			...prev,
			timeRange
		}));
	};

	return {
		timeRange: settings.timeRange,
		updateTimeRange,
	};
};