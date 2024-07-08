import { isFuture } from 'date-fns';
import { Badge } from './ui/badge';

interface BookingStatusBadgeProps {
	bookingDate: Date;
}

export function BookingStatusBadge({ bookingDate }: BookingStatusBadgeProps) {
	const isConfirmedBooking = isFuture(bookingDate);

	return (
		<Badge variant={isConfirmedBooking ? 'default' : 'secondary'}>
			{isConfirmedBooking ? 'Marcado' : 'Finalizado'}
		</Badge>
	);
}
