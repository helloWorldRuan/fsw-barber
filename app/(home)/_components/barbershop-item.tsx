import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Barbershop } from '@prisma/client';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';

interface BarbershopItemProps {
	barbershop: Barbershop;
}

export function BarbershopItem({ barbershop }: BarbershopItemProps) {
	return (
		<Card className="w-min-[167px] w-[167px] rounded-2xl">
			<CardContent className="p-0 w-full flex flex-col justify-between items-start">
				<div className="p-1 w-[167px] h-[159px] overflow-hidden relative">
					<div className="absolute left-2 top-2 z-50">
						<Badge className="bg-[#150029]/50 flex items-center justify-between gap-1 backdrop-blur-sm">
							<StarIcon size={12} className="fill-primary text-primary" />
							<span>5,0</span>
						</Badge>
					</div>

					<Image
						width={0}
						height={0}
						sizes="100vw"
						src={barbershop.imageUrl}
						alt={barbershop.name}
						className="w-[167px] h-[159px] object-cover rounded-2xl"
					/>
				</div>

				<div className="w-full p-2">
					<h2 className="font-bold text-ellipsis overflow-hidden text-nowrap">
						{barbershop.name}
					</h2>
					<h3 className="text-sm text-gray-400 text-ellipsis overflow-hidden text-nowrap">
						{barbershop.address}
					</h3>

					<Button variant="secondary" className="w-full mt-2">
						Reservar
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
