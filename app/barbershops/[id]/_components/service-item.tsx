'use client';

import { Button } from '@/app/_components/ui/button';
import { Calendar } from '@/app/_components/ui/calendar';
import { Card, CardContent } from '@/app/_components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/app/_components/ui/sheet';
import { Barbershop, Service } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { formatPriceToBRL } from '../_helpers/formatPrice';
import { generateDayTimeList } from '../_helpers/hours';
import { styles } from '../_helpers/styles';
import { ServiceSummaryItem } from './service-summary-item';

interface ServiceItemProps {
	service: Service;
	barbershop: Barbershop;
	isAuthenticated: boolean;
}

export function ServiceItem({
	service,
	barbershop,
	isAuthenticated,
}: ServiceItemProps) {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [bookedHour, setBookedHour] = useState<string>('');

	const handleBookingClick = () => {
		if (!isAuthenticated) return signIn('google');

		// TODO open booking page
	};

	const handleToggleBookHour = (time: string) => {
		if (bookedHour === time) {
			return setBookedHour('');
		}

		setBookedHour(time);
	};

	const handleSetHour = (date: Date | undefined) => {
		setBookedHour('');

		setDate(date);
	};

	const timeList = useMemo(() => {
		return date ? generateDayTimeList(date) : [];
	}, [date]);

	return (
		<Card>
			<CardContent className="w-full p-2 flex justify-start items-center gap-4">
				<div className="relative min-w-[110px] max-w-[110px] min-h-[110px] max-h-[110px] overflow-hidden rounded-lg">
					<Image
						src={service.imageUrl}
						alt={service.name}
						fill
						style={{ objectFit: 'contain' }}
					/>
				</div>

				<div className="w-full flex flex-col justify-start items-start">
					<h2 className="font-bold">{service.name}</h2>
					<p className="text-sm text-gray-400 mb-3">{service.description}</p>

					<div className="w-full flex justify-between items-center">
						<h3 className=" font-bold text-primary">
							{formatPriceToBRL(service.price)}
						</h3>

						<Sheet>
							<SheetTrigger asChild>
								<Button
									onClick={handleBookingClick}
									variant="secondary"
									className="text-sm"
								>
									Reservar
								</Button>
							</SheetTrigger>

							<SheetContent className="p-0">
								<SheetHeader className="text-left p-5 border-solid border-b border-secondary">
									<SheetTitle>Fazer reserva</SheetTitle>
								</SheetHeader>

								<Calendar
									className="w-full"
									mode="single"
									selected={date}
									onSelect={handleSetHour}
									locale={ptBR}
									fromDate={new Date()}
									styles={styles.CALENDAR}
								/>

								{date && (
									<div className="flex justify-between items-center gap-2 py-6 px-5 overflow-x-auto no-scrollbar border-t border-solid border-secondary">
										{timeList.map((time) => (
											<Button
												onClick={() => handleToggleBookHour(time)}
												className="rounded-full"
												variant={`${
													bookedHour === time ? 'default' : 'outline'
												}`}
												key={time}
											>
												{time}
											</Button>
										))}
									</div>
								)}

								<div className="py-6 px-5 border-y border-solid border-secondary">
									<Card>
										<CardContent className="p-3 flex flex-col gap-3">
											<ServiceSummaryItem
												label={service.name}
												value={formatPriceToBRL(service.price)}
												bold
											/>

											<ServiceSummaryItem
												label="Data"
												value={format(date?.toString()!, "dd 'de' MMMM", {
													locale: ptBR,
												})}
											/>

											<ServiceSummaryItem
												label="Horário"
												value={bookedHour ? bookedHour : 'hh:mm'}
											/>

											<ServiceSummaryItem
												label="Barbearia"
												value={barbershop.name}
											/>
										</CardContent>
									</Card>
								</div>

								<SheetFooter className="p-5">
									<Button disabled={!(date && bookedHour)} className="w-full">
										Confirmar reserva
									</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
