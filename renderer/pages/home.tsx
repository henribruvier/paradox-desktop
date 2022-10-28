import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import type { User, Game, Scenario } from "@prisma/client";

export const formatDate = (
  date: string | Date,
  style?: "long" | "medium" | "short"
): string =>
  Intl.DateTimeFormat("fr-FR", { timeStyle: style ? style : "short" })
    .format(new Date(date))
    .split(" ")
    .map((str, i) => (i === 0 ? str[0].toUpperCase() + str.slice(1) : str))
    .join(" ");

function Home() {
  const { data: games } = trpc.game.all.useQuery(undefined, {
    refetchInterval: 1000,
  });
  const startGameMutation = trpc.game.start.useMutation();
  const router = useRouter();
  const endGameMutation = trpc.game.end.useMutation();
  const changeStatusMutation = trpc.game.changeStatus.useMutation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expoPushToken, setExpoPushToken] = useState("");

  const [userId, setUserId] = useState<number | null>();
  const data = trpc.user.one.useQuery({ id: userId }, { enabled: !!userId });
  const [user, setUser] = useState<User | null>(data.data);

  useEffect(() => {
    const jsonValue = localStorage.getItem("@user_obj");
    if (jsonValue !== null) {
      const user = JSON.parse(jsonValue);
      setUserId(() => user.id);
    }
  }, []);

  useEffect(() => {
    if (!data.data) return;
    setUser(data.data);
    if (!data.data || data.data.role !== "admin") {
      router.push("login");
    }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(async () => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const todaysGames = games?.filter((game) => {
    const today = new Date();
    const gameDate = new Date(game.startDate);

    return (
      today.getDate() === gameDate.getDate() &&
      today.getMonth() === gameDate.getMonth() &&
      today.getFullYear() === gameDate.getFullYear()
    );
  });

  const statusToBadge = {
    NOT_STARTED: (
      <div className="bg-gray-300 py-1 px-2 rounded-full flex items-center justify-center">
        <p className="text-base text-white pt font-bold   ">{`not started`}</p>
      </div>
    ),
    IN_PROGRESS: (
      <div className="bg-orange-400 py-1 px-2 rounded-full flex items-center justify-center">
        <p className="text-base text-white pt font-bold   ">{`en cours`}</p>
      </div>
    ),
    IN_TIME_OVER: (
      <div className="bg-red-400 py-1 px-2 rounded-full flex items-center justify-center">
        <p className="text-base text-white pt font-bold   ">{`out of time !`}</p>
      </div>
    ),
    FINISHED: (
      <div className="bg-green-400 py-1 px-2 rounded-full flex items-center justify-center">
        <p className="text-base text-white pt font-bold   ">{`Terminé`}</p>
      </div>
    ),
  };
  const startGame = async (gameId: number) => {
    await startGameMutation.mutateAsync({ id: gameId });
  };
  const endGame = async (
    game: Game & {
      scenario: Scenario;
    }
  ) => {
    if (game.startedAt)
      await endGameMutation.mutateAsync({
        id: game.id,
        startDate: game.startedAt,
        bestTime: game.scenario.bestTime,
      });
  };
  return (
    <React.Fragment>
      <Head>
        <title>Home - Paradox</title>
      </Head>

      <div className="h-full w-full px-2">
        <p className="text-5xl font-bold mx-auto pb-10 ">
          Game of <p className="text-indigo-500">Today</p>
        </p>
        <p className="text-5xl font-bold mx-auto pb-10 ">
          <p className="text-indigo-500">{formatDate(currentDate, "medium")}</p>
        </p>

        <div className="flex flex-col gap-3 w-auto">
          {todaysGames?.map((game) => (
            <div className="flex flex-col  items-start justify-start  border-b-2 border-indigo-300 pb-2">
              <div className="flex flex-row w-full justify-between items-center">
                <p className="text-lg font-bold  pb-2">
                  {`Game:${game.id} start at ${formatDate(game.startDate)}  `}
                </p>
                {game.status === "NOT_STARTED" && (
                  <button
                    onClick={async () => await startGame(game.id)}
                    className="flex items-center justify-center bg-indigo-500 rounded-full py-2 px-4"
                  >
                    <p className="font-bold text-white">Start Game</p>
                  </button>
                )}
                {(game.status === "IN_PROGRESS" ||
                  game.status === "IN_TIME_OVER") && (
                  <button
                    onClick={async () => await endGame(game)}
                    className="flex items-center justify-center bg-indigo-500 rounded-full py-2 px-4"
                  >
                    <p className="font-bold text-white">End game</p>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap flex-row gap-2 items-center">
                {statusToBadge[game.status]}
                <div className="flex flex-col">
                  {(game.status === "IN_PROGRESS" ||
                    game.status === "IN_TIME_OVER") && (
                    <>
                      {game.startedAt && (
                        <>
                          <p className="font-bold text-indigo-400">{`started at : ${formatDate(
                            game.startedAt
                          )}`}</p>
                          <p className="font-bold text-indigo-400">{`end : ${formatDate(
                            new Date(
                              game.startedAt.getTime() +
                                game.scenario.duration * 1000
                            )
                          )}`}</p>
                        </>
                      )}
                    </>
                  )}
                  {game.status === "FINISHED" && (
                    <p className="font-bold text-indigo-400">{`temps réalisé : ${
                      game.timeSpent && Math.round(game.timeSpent / 60)
                    } minutes`}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
