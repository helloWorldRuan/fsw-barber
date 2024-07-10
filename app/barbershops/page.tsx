import { BarbershopItem } from '../(home)/_components/barbershop-item';
import { Header } from '../_components/header';
import { db } from '../_lib/prisma';

interface BarbershopPageProps {
	searchParams: {
		search: string;
	};
}

export default async function BarbershopPage({
	searchParams,
}: BarbershopPageProps) {
	const barbershops = await db.barbershop.findMany({
		where: {
			name: {
				contains: searchParams.search,
				mode: 'insensitive',
			},
		},
	});

	return (
		<>
			<Header />

			<div className="px-5 py-6">
				<h1 className="text-xs text-gray-400 font-bold uppercase">
					Resultados para &quot;{searchParams.search}&quot;
				</h1>

				<div className="grid grid-cols-2 gap-4 mt-3 ">
					{barbershops.map((barbershop) => (
						<div key={barbershop.id} className="w-full">
							<BarbershopItem barbershop={barbershop} />
						</div>
					))}
				</div>
			</div>
		</>
	);
}
