import { authOptions } from '@/app/_lib/auth';
import { db } from '@/app/_lib/prisma';
import { getServerSession } from 'next-auth';
import { BarbershopInfo } from './_components/barbershop-info';
import { ServiceItem } from './_components/service-item';

interface BarbershopDetailsProps {
	params: {
		id?: string;
	};
}

export default async function BarbershopDetails({
	params,
}: BarbershopDetailsProps) {
	const session = await getServerSession(authOptions);

	if (!params.id) {
		// TODO: redirect to home
		return null;
	}

	const barbershop = await db.barbershop.findUnique({
		where: {
			id: params.id,
		},
		include: {
			services: true,
		},
	});

	if (!barbershop) {
		// TODO: redirect to home
		return null;
	}

	return (
		<>
			<div className="pb-6 lg:pt-6 border-b border-solid border-secondary">
				<div className="lg:w-3/4 m-auto">
					<BarbershopInfo barbershop={barbershop} />
				</div>
			</div>

			<div className="w-full lg:w-3/4 m-auto sm:py-5 lg:pt-5 grid lg:grid-cols-4 gap-3">
				{barbershop.services.map((service) => (
					<div key={service.id}>
						<ServiceItem
							service={service}
							barbershop={barbershop}
							isAuthenticated={!!session?.user}
						/>
					</div>
				))}
			</div>
		</>
	);
}
