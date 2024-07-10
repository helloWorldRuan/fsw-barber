'use client';

import { ServiceSummary } from '@/app/_components/service-summary';
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
import { Barbershop, Booking, Service } from '@prisma/client';
import { format, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getBookingsByDate } from '../_actions/get-bookings';
import { saveBooking } from '../_actions/save-booking';
import { formatPriceToBRL } from '../_helpers/formatPrice';
import { getAvailableTimeSlots } from '../_helpers/hours';
import { styles } from '../_helpers/styles';

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
	const router = useRouter();
	const { data } = useSession();

	const [date, setDate] = useState<Date | undefined>(new Date());
	const [bookedHour, setBookedHour] = useState<string>('');
	const [isSubmitLoading, setIsSubmitLoading] = useState(false);
	const [isOpenSheet, setIsOpenSheet] = useState(false);
	const [dayBooking, setDayBooking] = useState<Booking[]>([]);

	useEffect(() => {
		if (!date) return;

		const refreshAvailableHours = async () => {
			const data = await getBookingsByDate(barbershop.id, date);

			setDayBooking(data);
		};

		refreshAvailableHours();
	}, [date, barbershop]);

	const handleBookingClick = () => {
		if (!isAuthenticated) return signIn('google');
	};

	const handleToggleBookHour = (time: string) => {
		if (bookedHour === time) {
			return setBookedHour('');
		}

		setBookedHour(time);
	};

	const handleSetDate = (date: Date | undefined) => {
		if (date) {
			const today =
				format(date, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy');
			const newDate = today ? new Date() : date;

			setBookedHour('');
			setDate(newDate);
		}
	};

	const handleBookingSubmit = async () => {
		setIsSubmitLoading(true);

		try {
			if (!(date || bookedHour || data?.user)) return;

			const hour = Number(bookedHour.split(':')[0]);
			const minutes = Number(bookedHour.split(':')[1]);

			const dateTime = setMinutes(setHours(date!!, hour), minutes);

			await saveBooking({
				barbershopId: barbershop.id,
				serviceId: service.id,
				userId: (data?.user as any).id,
				date: dateTime,
			});

			setIsOpenSheet(false);

			setBookedHour('');
			setDate(undefined);

			toast('Reserva marcada com sucesso', {
				description: format(dateTime, "'Para' dd 'de' MMMM 'às' HH:mm '.'", {
					locale: ptBR,
				}),
				action: {
					label: 'Visualizar',
					onClick: () => router.push('/bookings'),
				},
			});
		} catch {
			toast('☹️ Não foi possível agendar no momento');
		} finally {
			setIsSubmitLoading(false);
		}
	};

	const timeList = useMemo(() => {
		if (!date) return [];

		return getAvailableTimeSlots(date).filter((time) => {
			const timeHour = Number(time.split(':')[0]);
			const timeMinutes = Number(time.split(':')[1]);

			const booking = dayBooking.find((booking) => {
				const bookingHour = booking.date.getHours();
				const bookingMinutes = booking.date.getMinutes();

				return bookingHour === timeHour && bookingMinutes === timeMinutes;
			});

			return !booking ? true : false;
		});
	}, [date, dayBooking]);

	return (
		<Card>
			<CardContent className="w-full lg:h-[250px] p-2 flex justify-start items-center gap-4 lg:flex-col">
				<div className="relative size-[110px] lg:w-full overflow-hidden rounded-lg">
					<Image
						src={service.imageUrl}
						alt={service.name}
						fill
						style={{ objectFit: 'cover' }}
					/>
				</div>

				<div className="w-full flex flex-col justify-start items-start lg:px-2 lg:pb-2">
					<h2 className="font-bold">{service.name}</h2>
					<p className="text-sm text-gray-400 mb-3">{service.description}</p>

					<div className="w-full flex justify-between items-center">
						<h3 className=" font-bold text-primary">
							{formatPriceToBRL(service.price)}
						</h3>

						<Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
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
									onSelect={handleSetDate}
									locale={ptBR}
									fromDate={new Date()}
									styles={styles.CALENDAR}
								/>

								{date && (
									<div className="flex justify-start items-center gap-2 py-6 px-5 overflow-x-auto custom-scrollbar border-t border-solid border-secondary">
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
									<ServiceSummary
										service={service}
										date={date}
										bookedHour={bookedHour}
										barbershop={barbershop}
									/>
								</div>

								<SheetFooter className="p-5">
									<Button
										onClick={handleBookingSubmit}
										disabled={!(date && bookedHour) || isSubmitLoading}
										className="w-full"
									>
										{isSubmitLoading && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
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
