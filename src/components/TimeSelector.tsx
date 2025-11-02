import React from 'react';
import type { TimeRange } from '../types';
import TIME_RANGES from '../utils/constants/timeRanges';

// Props для компонента TimeSelector
interface ITimeSelectorProps {
	selectedRange: TimeRange; // Выбранный временной диапазон
	onRangeChange: (range: TimeRange) => void; // Callback при изменении диапазона
}

// Компонент выбора временного диапазона для отображения погодных данных
export const TimeSelector: React.FC<ITimeSelectorProps> = ({
	selectedRange,
	onRangeChange,
}) => {
	return (
		<section
			className="time-selector time-selector--sticky"
			aria-labelledby="time-selector-title"
		>
			<h2 id="time-selector-title" className="time-selector__title">
				Период прогноза
			</h2>
			<p className="time-selector__description">
				Выберите временной диапазон для отображения данных
			</p>

			<div
				className="time-selector__buttons"
				role="radiogroup"
				aria-labelledby="time-selector-title"
			>
				{TIME_RANGES.map(range => (
					<button
						key={range.value}
						type="button"
						// Модификатор --active применяется к активной кнопке
						className={`time-selector__button ${
							selectedRange === range.value
								? 'time-selector__button--active'
								: ''
						}`}
						// Обработчик клика передает выбранное значение в родительский компонент
						onClick={() => onRangeChange(range.value)}
						// role="radio"
						aria-checked={selectedRange === range.value}
						aria-label={`Показать данные за ${range.label.toLowerCase()}`}
					>
						{range.label}
					</button>
				))}
			</div>
		</section>
	);
};
