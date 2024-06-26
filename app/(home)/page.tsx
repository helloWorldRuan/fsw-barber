import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookingItem } from '../_components/booking-item';
import { Header } from '../_components/header';
import { Search } from './_components/search';

export default function Home() {
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

			<div className="px-5 mt-10 flex flex-col gap-3">
				<h2 className="uppercase text-gray-400 text-sm font-bold">
					Agendamentos
				</h2>

				<BookingItem />
			</div>
		</>
	);
}
