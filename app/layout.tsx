import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from './_components/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'FSW Barber',
	description: 'Barbershop services booking',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-br">
			<body className={`${inter.className} dark`}>
				{children}

				<Footer />
			</body>
		</html>
	);
}
