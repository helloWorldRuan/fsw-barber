'use client';

import {
	Calendar,
	HomeIcon,
	LogInIcon,
	LogOutIcon,
	MenuIcon,
	UserIcon,
} from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet';

export function Header() {
	const { data } = useSession();

	const handleSignOut = () => signOut();

	const handleSignIn = () => signIn('google');

	return (
		<Card>
			<CardContent className="py-5 flex justify-between items-center">
				<Image src="/logo.png" alt="logo" height={40} width={130} />

				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<MenuIcon size={18} />
						</Button>
					</SheetTrigger>

					<SheetContent className="p-0">
						<SheetHeader className="text-left p-5 border-solid border-b border-secondary">
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>

						<div className="p-5 flex justify-between items-center">
							{data?.user ? (
								<>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src={data.user.image ?? ''} />
										</Avatar>

										<h2>{data.user.name}</h2>
									</div>

									<Button
										onClick={handleSignOut}
										variant="secondary"
										size="icon"
									>
										<LogOutIcon />
									</Button>
								</>
							) : (
								<div className="w-full flex flex-col gap-4">
									<div className="flex items-center gap-3">
										<div className="bg-zinc-800/80 size-9 rounded-full grid place-content-center">
											<UserIcon size={18} />
										</div>

										<h2>Olá, faça seu login!</h2>
									</div>

									<Button
										onClick={handleSignIn}
										className="w-full flex justify-start items-center gap-2 p-4"
										variant="secondary"
									>
										<LogInIcon size={18} />
										Fazer login
									</Button>
								</div>
							)}
						</div>

						<div className="px-5 flex flex-col gap-3">
							<Button
								asChild
								variant="outline"
								className="w-full flex justify-start items-center gap-2 py-4"
							>
								<Link href="/">
									<HomeIcon size={18} />
									Início
								</Link>
							</Button>

							{data?.user && (
								<Button
									asChild
									variant="outline"
									className="w-full flex justify-start items-center gap-2 py-4"
								>
									<Link href="/bookings">
										<Calendar size={18} />
										Início
									</Link>
								</Button>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</CardContent>
		</Card>
	);
}
