import {t} from '../trpc';
import {z} from 'zod';

export const userRouter = t.router({
	all: t.procedure.query(({ctx}) => {
		return ctx.prisma.user.findMany();
	}),
	one: t.procedure.input(z.object({id: z.number()})).query(({ctx, input}) => {
		return ctx.prisma.user.findFirst({
			where: {id: input.id},
		});
	}),
	byId: t.procedure
		.input(z.object({name: z.string(), password: z.string()}))
		.query(({ctx, input}) => {
			return ctx.prisma.user.findFirst({
				where: {name: input.name, password: input.password},
			});
		}),
	create: t.procedure
		.input(
			z.object({
				name: z.string(),
				password: z.string(),
			}),
		)
		.mutation(({ctx, input}) => {
			return ctx.prisma.user.create({data: input});
		}),
});
