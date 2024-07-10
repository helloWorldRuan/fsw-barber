import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getServerSession } from 'next-auth';
import { BookingItem } from '../_components/booking-item';
import { Header } from '../_components/header';
import { authOptions } from '../_lib/auth';
import { db } from '../_lib/prisma';
import { BarbershopItem } from './_components/barbershop-item';
import { Search } from './_components/search';

export default async function Home() {
	const session = await getServerSession(authOptions);

	const barbershops = await db.barbershop.findMany({});

	let confirmedBookings: any[] = [];

	if ((session?.user as any)?.id) {
		confirmedBookings = await db.booking.findMany({
			where: {
				userId: (session as any)?.id,
				date: {
					gte: new Date(),
				},
			},
			include: {
				service: true,
				barbershop: true,
			},
			orderBy: {
				date: 'asc',
			},
			take: 3,
		});
	}

	return (
		<>
			<Header />

			<div className="pt-5 px-5">
				<h2 className="text-xl font-bold">
					{session?.user
						? `Olá, ${session?.user.name?.split(' ')[0]}!`
						: 'Olá! Vamos agendar um corte hoje?'}
				</h2>

				<p className="capitalize text-sm">
					{format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
				</p>
			</div>

			<div className="px-5 mt-7">
				<Search />
			</div>

			{confirmedBookings.length > 0 && (
				<div className="px-5 mt-10">
					<h2 className="uppercase text-gray-400 text-sm font-bold mb-3">
						Agendamentos
					</h2>

					<div className="flex gap-4 overflow-x-auto no-scrollbar">
						{confirmedBookings.map((booking) => (
							<BookingItem key={booking.id} booking={booking} />
						))}
					</div>
				</div>
			)}

			<div className="px-5 mt-10 ">
				<h2 className="uppercase text-gray-400 text-sm font-bold mb-3">
					Recomendados
				</h2>

				<div className="grid grid-flow-col gap-4 overflow-x-auto no-scrollbar">
					{barbershops.map((barbershop) => (
						<div className="w-[167px]" key={barbershop.id}>
							<BarbershopItem barbershop={barbershop} />
						</div>
					))}
				</div>
			</div>

			<div className="px-5 mt-10">
				<h2 className="uppercase text-gray-400 text-sm font-bold mb-3">
					Populares
				</h2>

				<div className="grid grid-flow-col gap-4 overflow-x-auto no-scrollbar">
					{barbershops.map((barbershop) => (
						<div className="w-[167px]" key={barbershop.id}>
							<BarbershopItem barbershop={barbershop} />
						</div>
					))}
				</div>
			</div>
		</>
	);
}
