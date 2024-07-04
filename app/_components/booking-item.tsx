'use client';

import { Prisma } from '@prisma/client';
import { isFuture } from 'date-fns';
import { format } from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

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

	const isConfirmedBooking = isFuture(booking.date);

	return (
		<Card>
			<CardContent className="flex items-center justify-between p-0">
				<div className="flex flex-col gap-2 justify-center items-start p-5">
					<Badge variant={isConfirmedBooking ? 'default' : 'secondary'}>
						{isConfirmedBooking ? 'Marcado' : 'Finalizado'}
					</Badge>
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
	);
}
