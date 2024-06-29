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
import { format, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { saveBooking } from '../_actions/save-booking';
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
	const router = useRouter();
	const { data } = useSession();

	const [date, setDate] = useState<Date | undefined>(new Date());
	const [bookedHour, setBookedHour] = useState<string>('');
	const [isSubmitLoading, setIsSubmitLoading] = useState(false);
	const [isOpenSheet, setIsOpenSheet] = useState(false);

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
