import {t} from '../trpc';
import {z} from 'zod';

export const scenarioRouter = t.router({
	all: t.procedure.query(({ctx}) => {
		return ctx.prisma.scenario.findMany();
	}),
	byId: t.procedure.input(z.number()).query(({ctx, input}) => {
		return ctx.prisma.scenario.findFirst({where: {id: input}});
	}),
	delete: t.procedure.input(z.number()).mutation(({ctx, input}) => {
		return ctx.prisma.scenario.delete({where: {id: input}});
	}),
	create: t.procedure
		.input(
			z.object({
				title: z.string(),
				description: z.string(),
				duration: z.number(),
				minimumPlayers: z.number(),
				maximumPlayers: z.number(),
				difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
			}),
		)
		.mutation(({ctx, input}) => {
			return ctx.prisma.scenario.create({data: input});
		}),
	update: t.procedure
		.input(
			z.object({
				id: z.number(),
				title: z.string(),
				description: z.string(),
				duration: z.number(),
				minimumPlayers: z.number(),
				maximumPlayers: z.number(),
				difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
			}),
		)
		.mutation(({ctx, input}) => {
			return ctx.prisma.scenario.update({where: {id: input.id}, data: input});
		}),
	deleteById: t.procedure.input(z.number()).mutation(({ctx, input}) => {
		return ctx.prisma.scenario.delete({where: {id: input}});
	}),
});
