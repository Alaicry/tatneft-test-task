import React from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
	type ChartOptions,
} from 'chart.js';
import type { WeatherResponse, TimeRange } from '../types';
import filterWeatherData from '../utils/functions/filterWeatherData';

// Регистрация необходимых компонентов Chart.js
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

// Пропсы компонента графика погоды
interface IWeatherChartProps {
	cityName: string; // Название города
	weatherData: WeatherResponse; // Данные о погоде
	timeRange: TimeRange; // Выбранный временной диапазон
}

export const WeatherChart: React.FC<IWeatherChartProps> = ({
	cityName,
	weatherData,
	timeRange,
}) => {
	// Фильтрация данных по выбранному временному диапазону
	const chartData = filterWeatherData(weatherData, timeRange);

	// Конфигурация данных для графика
	const data = {
		// Форматирование меток оси X в зависимости от временного диапазона
		labels: chartData.map(point => {
			const date = new Date(point.time);
			// Для коротких диапазонов (6h, 24h) показываем время
			if (timeRange === '6h' || timeRange === '24h') {
				return date.toLocaleTimeString('ru-RU', {
					hour: '2-digit',
					minute: '2-digit',
				});
			}
			// Для длинных диапазонов (7d) показываем дату
			return date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'short',
			});
		}),
		datasets: [
			{
				label: 'Температура °C',
				data: chartData.map(point => point.temperature),
				borderColor: '#1976d2', // Синий цвет линии
				backgroundColor: 'rgba(25, 118, 210, 0.1)', // Полупрозрачная заливка под линией
				borderWidth: 3,
				fill: true, // Включить заливку под линией
				tension: 0.4, // Сглаживание линии (0-1)
				pointRadius: 6, // Размер точек на графике
				pointBackgroundColor: '#1976d2', // Цвет точек
				pointBorderColor: '#ffffff', // Цвет обводки точек
				pointBorderWidth: 2, // Толщина обводки точек
				pointHoverRadius: 8, // Размер точек при наведении
				pointHoverBackgroundColor: '#1976d2',
				pointHoverBorderColor: '#ffffff',
				pointHoverBorderWidth: 3,
			},
		],
	};

	// Конфигурация опций графика
	const options: ChartOptions<'line'> = {
		responsive: true, // Адаптивность под размер контейнера
		maintainAspectRatio: false, // Отключение сохранения пропорций

		// Настройки взаимодействия с графиком
		interaction: {
			mode: 'index', // Режим взаимодействия по индексу данных
			intersect: false, // Не требовать точного пересечения с элементом
		},

		// Настройки плагинов
		plugins: {
			legend: {
				display: false, // Скрыть легенду (не нужна для одного набора данных)
			},
			tooltip: {
				mode: 'index',
				intersect: false,
				backgroundColor: '#ffffff', // Белый фон тултипа
				titleColor: '#1e293b', // Темно-серый цвет заголовка
				bodyColor: '#1976d2', // Синий цвет текста
				borderColor: '#e2e8f0', // Цвет границы тултипа
				borderWidth: 1,
				padding: 12,
				cornerRadius: 8,
				displayColors: false, // Скрыть цветные индикаторы

				// Настройки шрифта для тултипа
				titleFont: {
					family: "'Montserrat', sans-serif",
					size: 14,
					weight: 600,
				},
				bodyFont: {
					family: "'Montserrat', sans-serif",
					size: 13,
					weight: 500,
				},

				// Кастомные callback-функции для форматирования тултипа
				callbacks: {
					// Форматирование заголовка тултипа (полная дата и время)
					title: context => {
						const point = chartData[context[0].dataIndex];
						return new Date(point.time).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						});
					},
					// Форматирование текста тултипа
					label: context => {
						return `Температура: ${context.parsed.y}°C`;
					},
				},
			},
		},

		// Настройки осей графика
		scales: {
			// Ось X (время)
			x: {
				type: 'category',
				ticks: {
					maxTicksLimit: 8, // Максимальное количество меток
					color: '#1e293b',
					font: {
						family: "'Montserrat', sans-serif",
						size: 12,
					},
				},
				grid: {
					color: 'rgba(0, 0, 0, 0.1)', // Цвет сетки
				},
				title: {
					display: true,
					text: 'Время',
					color: '#1e293b',
					font: {
						family: "'Montserrat', sans-serif",
						size: 14,
						weight: 600,
					},
					padding: { top: 10, bottom: 0 },
				},
			},
			// Ось Y (температура)
			y: {
				type: 'linear',
				ticks: {
					color: '#1e293b',
					font: {
						family: "'Montserrat', sans-serif",
						size: 12,
					},
					// Форматирование значений температуры
					callback: function (this, tickValue) {
						const value =
							typeof tickValue === 'number'
								? tickValue
								: parseFloat(tickValue);
						return `${Math.round(value * 10) / 10}°C`; // Округление до 1 знака после запятой
					},
				},
				grid: {
					color: 'rgba(0, 0, 0, 0.1)',
				},
				title: {
					display: true,
					text: 'Температура °C',
					color: '#1e293b',
					font: {
						family: "'Montserrat', sans-serif",
						size: 14,
						weight: 600,
					},
					padding: { top: 0, bottom: 10 },
				},
			},
		},

		// Настройки поведения при наведении
		hover: {
			mode: 'index',
			intersect: false,
		},
	};

	return (
		<div className="weather-chart">
			{/* Заголовок с названием города */}
			<h3 className="weather-chart__title">{cityName}</h3>

			{/* Контейнер для графика */}
			<div className="weather-chart__container">
				<Line data={data} options={options} />
			</div>

			{/* Информация о часовом поясе */}
			<div className="weather-chart__info">
				<span className="weather-chart__timezone">
					<b>Часовой пояс:</b> {weatherData.timezone}
				</span>
			</div>
		</div>
	);
};
