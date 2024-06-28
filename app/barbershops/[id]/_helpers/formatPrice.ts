import { Decimal } from 'decimal.js';

/**
 * Formata um preço para o formato de moeda BRL (Real Brasileiro).
 *
 * @param price - O preço a ser formatado. Pode ser um número ou uma string que representa um número.
 * @returns Uma string formatada como moeda BRL.
 */
export const formatPriceToBRL = (price: number | string | Decimal): string => {
	let numberPrice: number;

	if (typeof price === 'string') {
		numberPrice = Number(price);
	} else if (price instanceof Decimal) {
		numberPrice = price.toNumber();
	} else {
		numberPrice = price;
	}

	if (isNaN(numberPrice)) {
		throw new Error('Invalid price value');
	}

	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(numberPrice);
};
