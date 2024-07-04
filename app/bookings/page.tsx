import { isFuture, isPast } from 'date-fns';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { BookingItem } from '../_components/booking-item';
import { Header } from '../_components/header';
import { db } from '../_lib/prisma';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function BookingsPage() {
	const session = await getServerSession(authOptions);

	if (!session) return redirect('/');

	const bookings = await db.booking.findMany({
		where: {
			userId: (session.user as any).id,
		},
		include: {
			service: true,
			barbershop: true,
		},
	});

	const { confirmedBookings, finishedBookings } = {
		confirmedBookings: bookings.filter((booking) => isFuture(booking.date)),
		finishedBookings: bookings.filter((booking) => isPast(booking.date)),
	};

	return (
		<>
			<Header />

			<div className="flex flex-col gap-6 py-5 px-6">
				<h1 className="font-bold text-xl">Agendamentos</h1>

				<div className="flex flex-col gap-2">
					<h2 className="text-gray-400 font-bold text-sm uppercase">
						Confirmados
					</h2>

					<div className="flex flex-col gap-4">
						{confirmedBookings.map((booking) => (
							<BookingItem key={booking.id} booking={booking} />
						))}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<h2 className="text-gray-400 font-bold text-sm uppercase">
						Finalizados
					</h2>

					<div className="flex flex-col gap-4">
						{finishedBookings.map((booking) => (
							<BookingItem key={booking.id} booking={booking} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}