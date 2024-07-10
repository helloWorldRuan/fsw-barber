import Image from 'next/image';
import Link from 'next/link';
import Menu from './menu';
import { Card, CardContent } from './ui/card';

export function Header() {
	return (
		<header>
			<Card>
				<CardContent className="py-5 flex justify-between items-center">
					<Link href={'/'}>
						<Image src="/logo.png" alt="logo" height={40} width={130} />
					</Link>
					<Menu />
				</CardContent>
			</Card>
		</header>
	);
}
