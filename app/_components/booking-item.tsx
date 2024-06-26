import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

export function BookingItem() {
	return (
		<Card>
			<CardContent className="flex items-center justify-between p-0">
				<div className="flex flex-col gap-2 justify-center items-start p-5">
					<Badge className="bg-[#221C3D] text-primary w-fit">Marcado</Badge>
					<h2 className="font-bold">Corte de cabelo</h2>

					<div className="flex justify-start items-center gap-1">
						<Avatar className="size-6">
							<AvatarImage src="" />

							<AvatarFallback>A</AvatarFallback>
						</Avatar>

						<h3 className="text-sm">Barbearia Di Garagi</h3>
					</div>
				</div>

				<div className="w-28 h-32 flex flex-col justify-center items-center border-l border-solid border-secondary">
					<p className="text-sm">Fevereiro</p>
					<p className="text-2xl">06</p>
					<p className="text-sm">12:45</p>
				</div>
			</CardContent>
		</Card>
	);
}
