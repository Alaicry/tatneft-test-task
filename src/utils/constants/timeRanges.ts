import type { TimeRangeConfig } from "../../types";

const TIME_RANGES: TimeRangeConfig[] = [
  { label: '6 часов', value: '6h', hours: 6 },
  { label: '24 часа', value: '24h', hours: 24 },
  { label: '3 дня', value: '3d', hours: 72 },
  { label: '7 дней', value: '7d', hours: 168 },
];

export default TIME_RANGES;