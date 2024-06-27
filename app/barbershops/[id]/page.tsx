import { db } from '@/app/_lib/prisma';
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
			<BarbershopInfo barbershop={barbershop} />

			<div className="p-5 flex flex-col gap-3">
				{barbershop.services.map((service) => (
					<ServiceItem key={service.id} service={service} />
				))}
			</div>
		</>
	);
}