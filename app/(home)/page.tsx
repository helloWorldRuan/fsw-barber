import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getServerSession } from 'next-auth';
import { BookingItem } from '../_components/booking-item';
import { Header } from '../_components/header';
import { db } from '../_lib/prisma';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { BarbershopItem } from './_components/barbershop-item';
import { Search } from './_components/search';

export default async function Home() {
	const session = await getServerSession(authOptions);

	const barbershops = await db.barbershop.findMany({});

	const bookings = await db.booking.findMany({
		where: {
			userId: (session as any).id,
		},
		include: {
			service: true,
			barbershop: true,
		},
		take: 3,
	});

	return (
		<>
			<Header />

			<div className="pt-5 px-5">
				<h2 className="text-xl font-bold">Olá, Juarez!</h2>

				<p className="capitalize text-sm">
					{format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
				</p>
			</div>

			<div className="px-5 mt-7">
				<Search />
			</div>

			<div className="px-5 mt-10">
				<h2 className="uppercase text-gray-400 text-sm font-bold mb-3">
					Agendamentos
				</h2>

				<div className="flex flex-col gap-4">
					{bookings.map((booking) => (
						<BookingItem key={booking.id} booking={booking} />
					))}
				</div>
			</div>

			<div className="px-5 mt-10 ">
				<h2 className="uppercase text-gray-400 text-sm font-bold mb-3">
					Recomendados
				</h2>

				<div className="flex gap-4 overflow-x-auto no-scrollbar">
					{barbershops.map((barbershop) => (
						<BarbershopItem key={barbershop.id} barbershop={barbershop} />
					))}
				</div>
			</div>

			<div className="px-5 mt-10">
				<h2 className="uppercase text-gray-400 text-sm font-bold mb-3">
					Populares
				</h2>

				<div className="flex gap-4 overflow-x-auto no-scrollbar">
					{barbershops.map((barbershop) => (
						<BarbershopItem key={barbershop.id} barbershop={barbershop} />
					))}
				</div>
			</div>
		</>
	);
}
