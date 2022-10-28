import {t} from '../trpc';
import {z} from 'zod';

export const FaqRouter = t.router({
	all: t.procedure.query(({ctx}) => {
		return ctx.prisma.faq.findMany();
	}),
	edit: t.procedure
		.input(
			z.object({
				id: z.number(),
				answer: z.string(),
				question: z.string(),
			}),
		)
		.query(({ctx, input}) => {
			return ctx.prisma.faq.update({
				where: {
					id: input.id,
				},
				data: {
					answer: input.answer,
					question: input.question,
				},
			});
		}),
});
