import {t} from '../trpc';
import {z} from 'zod';

export const roomRouter = t.router({
	all: t.procedure.query(({ctx}) => {
		return ctx.prisma.room.findMany();
	}),
	byId: t.procedure.input(z.number()).query(({ctx, input}) => {
		return ctx.prisma.room.findFirst({where: {id: input}});
	}),
	available: t.procedure
		.input(
			z.object({
				date: z.date(),
				duration: z.number(),
			}),
		)
		.query(({ctx, input}) => {
			return ctx.prisma.room.findMany({
				where: {
					NOT: [
						{
							OR: [
								{
									AND: [
										{
											games: {
												some: {
													startDate: {
														lte: new Date(
															input.date.getTime() + input.duration * 1000,
														),
													},
												},
											},
										},
										{
											games: {
												some: {
													startDate: {
														gte: input.date,
													},
												},
											},
										},
									],
								},
								{
									AND: [
										{
											games: {
												some: {
													endDate: {
														lte: new Date(
															input.date.getTime() + input.duration * 1000,
														),
													},
												},
											},
										},
										{
											games: {
												some: {
													endDate: {
														gte: input.date,
													},
												},
											},
										},
									],
								},
							],
						},
					],
				},
			});
		}),
});
