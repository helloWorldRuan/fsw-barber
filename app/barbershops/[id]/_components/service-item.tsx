'use client';

import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Service } from '@prisma/client';
import Image from 'next/image';

interface ServiceItemProps {
	service: Service;
}

export function ServiceItem({ service }: ServiceItemProps) {
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
							{Intl.NumberFormat('pt-BR', {
								style: 'currency',
								currency: 'BRL',
							}).format(Number(service.price))}
						</h3>

						<Button variant="secondary" className="text-sm">
							Reservar
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
