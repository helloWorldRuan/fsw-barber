interface ServiceSummaryItemProps {
	label: string;
	value: string;
	bold?: boolean;
}

export function ServiceSummaryItem({
	label,
	value,
	bold,
}: ServiceSummaryItemProps) {
	return (
		<div className="w-full flex justify-between items-center">
			<h3 className={`${bold ? 'font-bold' : 'text-gray-400 text-sm'} `}>
				{label}
			</h3>

			<h4 className={`${bold ? 'font-bold' : 'text-gray-400'}  text-sm`}>
				{value}
			</h4>
		</div>
	);
}
