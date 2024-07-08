import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import Decimal from 'decimal.js';
import { formatPriceToBRL } from '../barbershops/[id]/_helpers/formatPrice';
import { ServiceSummaryItem } from './service-summary-item';
import { Card, CardContent } from './ui/card';

interface ServiceSummaryProps {
	service: {
		name: string;
		price: Decimal;
	};
	date?: Date | null;
	bookedHour?: string;
	barbershop: {
		name: string;
	};
}

export function ServiceSummary({
	service,
	date,
	bookedHour,
	barbershop,
}: ServiceSummaryProps) {
	return (
		<Card>
			<CardContent className="p-3 flex flex-col gap-3">
				<ServiceSummaryItem
					label={service.name}
					value={formatPriceToBRL(service.price)}
					bold
				/>
				<ServiceSummaryItem
					label="Data"
					value={
						(date &&
							format(date.toString(), "dd 'de' MMMM", {
								locale: ptBR,
							})) ??
						''
					}
				/>
				<ServiceSummaryItem
					label="Horário"
					value={bookedHour ? bookedHour : 'hh:mm'}
				/>
				<ServiceSummaryItem label="Barbearia" value={barbershop.name} />
			</CardContent>
		</Card>
	);
}
