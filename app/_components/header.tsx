import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export function Header() {
	return (
		<>
			<Card>
				<CardContent className="py-5 flex justify-between items-center">
					<Image src="/logo.png" alt="logo" height={40} width={130} />

					<Button variant="outline" size="icon">
						<MenuIcon size={18} />
					</Button>
				</CardContent>
			</Card>
		</>
	);
}
