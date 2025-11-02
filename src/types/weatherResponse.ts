export type WeatherResponse = {
	hourly: {
		time: string[];
		temperature_2m: number[];
	};
	timezone: string;
	hourly_units: {
		temperature_2m: string;
	};
}