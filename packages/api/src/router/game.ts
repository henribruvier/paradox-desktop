import {t} from '../trpc';
import {z} from 'zod';

export const gameRouter = t.router({
	all: t.procedure.query(({ctx}) => {
		return ctx.prisma.game.findMany({
			include: {
				scenario: true, // Return all fields
			},
		});
	}),
	byId: t.procedure.input(z.number()).query(({ctx, input}) => {
		return ctx.prisma.game.findFirst({where: {id: input}});
	}),
	end: t.procedure
		.input(
			z.object({
				id: z.number(),
				startDate: z.date(),
				bestTime: z.number().nullable(),
			}),
		)
		.mutation(async ({ctx, input}) => {
			const timeSpent = Math.round(
				Math.abs(input.startDate.getTime() - new Date().getTime()) / 1000,
			);

			return ctx.prisma.game.update({
				where: {id: input.id},
				data: {
					status: 'FINISHED',
					timeSpent,
					scenario: {
						update: {
							bestTime:
								!input.bestTime || input.bestTime > timeSpent
									? timeSpent
									: input.bestTime,
						},
					},
				},
			});
		}),
	start: t.procedure
		.input(z.object({id: z.number()}))
		.mutation(({ctx, input}) => {
			return ctx.prisma.game.update({
				where: {id: input.id},
				data: {status: 'IN_PROGRESS', startedAt: new Date()},
			});
		}),
	changeStatus: t.procedure
		.input(
			z.object({
				id: z.number(),
				status: z.enum([
					'NOT_STARTED',
					'IN_PROGRESS',
					'IN_TIME_OVER',
					'FINISHED',
				]),
			}),
		)
		.mutation(({ctx, input}) => {
			return ctx.prisma.game.update({
				where: {id: input.id},
				data: {status: input.status},
			});
		}),
	create: t.procedure
		.input(
			z.object({
				scenario: z.number(),
				numberOfPlayers: z.number(),
				startDate: z.date(),
				endDate: z.date(),
				room: z.number(),
			}),
		)
		.mutation(({ctx, input}) => {
			return ctx.prisma.game.create({
				data: {
					numberOfPlayers: input.numberOfPlayers,
					startDate: input.startDate,
					endDate: input.endDate,
					room: {connect: {id: input.room}},
					scenario: {connect: {id: input.scenario}},
					status: 'NOT_STARTED',
				},
			});
		}),
});
