import { addMinutes, format, setHours, setMinutes } from 'date-fns';

function generateDailyTimeSlots(date: Date): string[] {
	const START_HOUR = 9;
	const END_HOUR = 21;
	const INTERVAL_MINUTES = 45;
	const timeList: string[] = [];

	let currentTime = setMinutes(setHours(date, START_HOUR), 0);

	while (currentTime <= setMinutes(setHours(date, END_HOUR), 0)) {
		timeList.push(format(currentTime, 'HH:mm'));
		currentTime = addMinutes(currentTime, INTERVAL_MINUTES);
	}

	return timeList;
}

/**
 * Retorna uma lista de intervalos de tempo disponíveis, filtrando para incluir
 * apenas horários que sejam pelo menos 45 minutos após o horário atual.
 *
 * @param date - A data para a qual a lista de horários será gerada.
 * @returns Uma lista ordenada de strings representando os horários disponíveis.
 */
export function getAvailableTimeSlots(date: Date): string[] {
	const compareTimes = (a: string, b: string): number => {
		const [hourA, minuteA] = a.split(':').map(Number);
		const [hourB, minuteB] = b.split(':').map(Number);

		if (hourA !== hourB) {
			return hourA - hourB;
		}
		return minuteA - minuteB;
	};

	const timeList = generateDailyTimeSlots(date);
	const cutoffTime = addMinutes(date, 45);
	const cutoffTimeInMinutes =
		cutoffTime.getHours() * 60 + cutoffTime.getMinutes();

	const filteredTimeList = timeList.filter((time) => {
		const [hour, minutes] = time.split(':').map(Number);
		return hour * 60 + minutes > cutoffTimeInMinutes;
	});

	return filteredTimeList.sort(compareTimes);
}
