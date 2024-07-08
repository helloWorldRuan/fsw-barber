'use client';

import { Prisma } from '@prisma/client';
import { isPast } from 'date-fns';
import { format } from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { cancelBooking } from '../_actions/cancel-booking';
import { BookingStatusBadge } from './booking-status-badge';
import { ServiceSummary } from './service-summary';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet';

interface BookingItemProps {
	booking: Prisma.BookingGetPayload<{
		include: {
			service: true;
			barbershop: true;
		};
	}>;
}

export function BookingItem({ booking }: BookingItemProps) {
	const { month, day, hour } = {
		month: format(booking.date, 'MMMM', { locale: ptBR }),
		day: format(booking.date, 'dd'),
		hour: format(booking.date, 'HH:mm'),
	};
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const handleCancelBooking = async () => {
		setIsDeleteLoading(true);

		try {
			await cancelBooking(booking.id);

			toast.success('Reserva cancelada com sucesso');
		} catch (error) {
			console.log('👽 ~ error:', error);
			toast.success('Não foi possível cancelar a reserva');
		} finally {
			setIsDeleteLoading(true);
		}
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Card>
					<CardContent className="flex items-center justify-between p-0">
						<div className="flex flex-col gap-2 justify-center items-start p-5">
							<BookingStatusBadge bookingDate={booking.date} />

							<h2 className="font-bold">{booking.service.name}</h2>

							<div className="flex justify-start items-center gap-2">
								<Avatar className="size-6">
									<AvatarImage src={booking.barbershop.imageUrl} />

									<AvatarFallback>A</AvatarFallback>
								</Avatar>

								<h3 className="text-sm translate-y-[1px]">
									{booking.barbershop.name}
								</h3>
							</div>
						</div>

						<div className="w-28 h-32 flex flex-col justify-center items-center border-l border-solid border-secondary">
							<p className="text-sm capitalize">{month}</p>
							<p className="text-2xl">{day}</p>
							<p className="text-sm">{hour}</p>
						</div>
					</CardContent>
				</Card>
			</SheetTrigger>

			<SheetContent className="px-0">
				<SheetHeader>
					<SheetTitle className="text-left px-5 pb-6 border-solid border-b border-secondary">
						Informações da Reserva
					</SheetTitle>
				</SheetHeader>

				<div className="px-5">
					<div className="relative h-[180px] my-6">
						<Image
							src="/barbershop-map.png"
							alt={booking.barbershop.name}
							fill
							style={{ objectFit: 'cover' }}
						/>

						<div className="w-full absolute bottom-4 left-0 px-5">
							<Card>
								<CardContent className="p-3 flex justify-start items-center gap-3">
									<Avatar>
										<AvatarImage src={booking.barbershop.imageUrl} />
									</Avatar>

									<div>
										<h2 className="font-bold">{booking.barbershop.name}</h2>
										<h3 className="text-xs text-nowrap text-ellipsis overflow-hidden">
											{booking.barbershop.address}
										</h3>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<BookingStatusBadge bookingDate={booking.date} />

						<ServiceSummary
							service={booking.service}
							barbershop={booking.barbershop}
							date={booking.date}
							bookedHour={format(new Date(booking.date), 'HH:mm')}
						/>

						<div className="flex flex-col gap-2 my-4">Adicionar telefones</div>
					</div>
				</div>

				<SheetFooter className="w-full grid grid-cols-2 gap-3 px-5">
					<SheetClose asChild>
						<Button variant="secondary">Voltar</Button>
					</SheetClose>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								disabled={isPast(booking.date) || isDeleteLoading}
								variant="destructive"
							>
								Cancelar reserva
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="w-[90%]">
							<AlertDialogHeader>
								<AlertDialogTitle>Cancelar Reserva?</AlertDialogTitle>

								<AlertDialogDescription>
									Tem certeza que deseja cancelar esse agendamento?
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter className="flex-row gap-3">
								<AlertDialogCancel className="w-full mt-0">
									Voltar
								</AlertDialogCancel>

								<AlertDialogAction
									onClick={handleCancelBooking}
									className="w-full mt-0"
								>
									Confirmar
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
