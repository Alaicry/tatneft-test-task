import React from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { useLocalStorage } from './hooks/useLocalStorage';
import { fetchWeatherData } from './store/slices/weatherSlice';
import { useEffect } from 'react';
import { TimeSelector } from './components/TimeSelector';
import { WeatherChart } from './components/WeatherChart';
import Container from './UI/Container';
import Header from './UI/Header';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ErrorState } from './components/ErrorState';

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const { data, loading, error } = useAppSelector(state => state.weather);
	const { timeRange, updateTimeRange } = useLocalStorage();

	useEffect(() => {
		dispatch(fetchWeatherData());
	}, [dispatch]);

	if (loading) {
		return (
			<div className="app">
				<Container>
					<Header />
					<TimeSelector
						selectedRange={timeRange}
						onRangeChange={updateTimeRange}
					/>
					{/* Скелетоны для загрузки графиков */}
					<div className="skeleton">
						<SkeletonTheme
							baseColor="#f1f5f9"
							highlightColor="#ffffff"
						>
							{[1, 2, 3].map(i => (
								<div key={i} className="skeleton__chart">
									<Skeleton
										height={48}
										width="60%"
										style={{ marginBottom: 16 }}
									/>

									<Skeleton height={300} borderRadius={16} />

									<Skeleton
										height={20}
										width="80%"
										style={{ marginTop: 16 }}
									/>
								</div>
							))}
						</SkeletonTheme>
					</div>
				</Container>
			</div>
		);
	}

	if (error) {
		return <ErrorState error={error} />;
	}

	return (
		<div className="app">
			<Container>
				<Header />
				<TimeSelector
					selectedRange={timeRange}
					onRangeChange={updateTimeRange}
				/>

				{Object.entries(data).map(([cityName, weatherData]) => (
					<WeatherChart
						key={cityName}
						cityName={cityName}
						weatherData={weatherData}
						timeRange={timeRange}
					/>
				))}
			</Container>
		</div>
	);
};

export default App;
