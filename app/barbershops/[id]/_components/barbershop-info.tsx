'use client';

import Menu from '@/app/_components/menu';
import { Button } from '@/app/_components/ui/button';
import { Barbershop } from '@prisma/client';
import { ChevronLeftIcon, MapPin, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BarbershopInfoProps {
	barbershop: Barbershop;
}

export function BarbershopInfo({ barbershop }: BarbershopInfoProps) {
	const router = useRouter();

	const handleReturnToHome = () => {
		router.replace('/');
	};

	return (
		<div className="w-full">
			<div className="h-[250px] w-full relative lg:rounded-3xl overflow-hidden">
				<div className="w-full h-[250px] bg-gradient-to-t from-black/80 from-30% absolute z-40" />

				<Button
					onClick={handleReturnToHome}
					variant="secondary"
					size="icon"
					className="absolute z-50 top-4 left-4"
				>
					<ChevronLeftIcon />
				</Button>

				<div className="absolute z-50 top-4 right-4">
					<Menu />
				</div>

				<Image
					src={barbershop.imageUrl}
					alt={barbershop.name}
					fill
					style={{ objectFit: 'cover' }}
				/>
			</div>

			<div className="px-5 pt-3 lg:absolute lg:-translate-y-28 z-50">
				<h1 className="text-xl font-bold mb-2">{barbershop.name}</h1>

				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-1">
						<MapPin size={16} className="text-primary" />
						<p className="text-sm">{barbershop.address}</p>
					</div>

					<div className="flex items-center gap-1">
						<StarIcon size={16} className="text-primary" />
						<p className="text-sm">4,7 (785 avaliações)</p>
					</div>
				</div>
			</div>
		</div>
	);
}
