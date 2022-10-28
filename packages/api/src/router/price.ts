import {t} from '../trpc';
import {z} from 'zod';

export const priceRouter = t.router({
	all: t.procedure.query(({ctx}) => {
		return ctx.prisma.price.findMany();
	}),
});
