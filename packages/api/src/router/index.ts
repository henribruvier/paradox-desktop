// src/server/router/index.ts
import {t} from '../trpc';

import {gameRouter} from './game';
import {userRouter} from './user';
import {roomRouter} from './room';
import {scenarioRouter} from './scenario';
import {priceRouter} from './price';

export const appRouter = t.router({
	game: gameRouter,
	user: userRouter,
	room: roomRouter,
	scenario: scenarioRouter,
	price: priceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
