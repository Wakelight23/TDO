import { getGameSessionByUserSocket } from "../session/game.session";

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다.');
  const gameSession = getGameSessionByUserSocket(socket);
  gameSession.removeUsersocket(socket);

  gameSession.stateSyn();
};