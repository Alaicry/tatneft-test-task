import type { ChartDataPoint } from "../../types";

const aggregateByDay = (
  times: string[], 
  temperatures: number[], 
  hoursToShow: number
): ChartDataPoint[] => {
  const dailyData: Record<string, { sum: number; count: number; date: Date }> = {};
  
  // Данные по дням
  for (let i = 0; i < times.length; i++) {
    const date = new Date(times[i]);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { sum: 0, count: 0, date };
    }
    
    dailyData[dateKey].sum += temperatures[i];
    dailyData[dateKey].count += 1;
  }

  // Преобразование в массив и вычисляется среднее
  const dailyArray = Object.entries(dailyData)
    .map(([date, data]) => ({
      time: date,
      temperature: Math.round((data.sum / data.count) * 10) / 10, // округление до 0.1
      date: data.date,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // сортирование по дате

  // Берутся последние X дней
  const daysToShow = Math.ceil(hoursToShow / 24);

  return dailyArray.slice(-daysToShow);
};

export default aggregateByDay;