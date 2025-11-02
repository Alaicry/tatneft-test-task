import type { ChartDataPoint, TimeRange, WeatherResponse } from "../../types";
import TIME_RANGES from "../constants/timeRanges";
import aggregateByDay from "./aggregateByDay";

const filterWeatherData = (
	data: WeatherResponse,
	timeRange: TimeRange
): ChartDataPoint[] => {
	const rangeConfig = TIME_RANGES.find(range => range.value === timeRange);
	if (!rangeConfig) return [];

	const { hourly } = data;

	// Усреднение за сутки
	if (timeRange === '3d' || timeRange === '7d') {
		return aggregateByDay(hourly.time, hourly.temperature_2m, rangeConfig.hours);
	}

	// Для часовых диапазонов обычная фильтрация
	const totalPoints = hourly.time.length;

	const pointsToShow = Math.min(rangeConfig.hours, totalPoints);
	
	const result: ChartDataPoint[] = [];

	for (let i = totalPoints - pointsToShow; i < totalPoints; i++) {
		result.push({
			time: hourly.time[i],
			temperature: hourly.temperature_2m[i],
			date: new Date(hourly.time[i]),
		});
	}

	return result;
};

export default filterWeatherData