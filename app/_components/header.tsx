import Image from 'next/image';
import Menu from './menu';
import { Card, CardContent } from './ui/card';

export function Header() {
	return (
		<Card>
			<CardContent className="py-5 flex justify-between items-center">
				<Image src="/logo.png" alt="logo" height={40} width={130} />

				<Menu />
			</CardContent>
		</Card>
	);
}
