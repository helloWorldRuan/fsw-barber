'use client';

import { Button } from '@/app/_components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	search: z.string().trim().min(1, 'Busque por uma barbearia...'),
});

interface SearchProps {
	defaultValues?: z.infer<typeof formSchema>;
}

export function Search({ defaultValues }: SearchProps) {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const handleSubmit = (data: z.infer<typeof formSchema>) => {
		router.push(`/barbershops?search=${data.search}`);
	};

	return (
		<div className="flex items-center gap-2">
			<Form {...form}>
				<form
					className="w-full flex gap-4"
					onSubmit={form.handleSubmit(handleSubmit)}
				>
					<FormField
						control={form.control}
						name="search"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input placeholder="Busque por uma barbearia..." {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">
						<SearchIcon size={18} />
					</Button>
				</form>
			</Form>
		</div>
	);
}
