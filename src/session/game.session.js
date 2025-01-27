import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

export const addGameSession = (id) => {
  const session = new Game(id);
  gameSessions.push(session);
  return session;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const removeGameSessionUser = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);

  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

// gameSessions에서 socket 기반으로 user를 찾는다
// onEnd.js에서 사용중
export const getGameSessionBySocket = (socket) => {
  return gameSessions.find((game) => game.users.some((user) => user.socket === socket));
};

export const getAllGameSessions = () => {
  return gameSessions;
};

export const notificationGameSessionsBySocket = (socket) => {
  for (const gameSession of gameSessions) {
    const findUser = gameSession.getUserBySocket(socket);
    if (findUser) {
      gameSession.stateSyn();
      break;
    }
  }
};

export const removeGameSessionSocket = (socket) => {
  for (const game of gameSessions) {
    const removedUser = game.removeUserSocket(socket); // 각 게임에서 소켓 기반 유저 제거
    if (removedUser) {
      break; // 유저를 찾으면 중단 (유저는 한 게임에만 존재한다고 가정)
    }
  }
};

export const getJoinGameSessions = (user) => {
  const gameId = user.getGameId();
  return gameSessions.find((session) => session.id === gameId);
};
