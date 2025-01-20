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

export const removeGameSessionUser = (socket) => {
  const index = gameSessions.findIndex((session) => session.id === id);

  
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

export const getAllGameSessions = () => {
  return gameSessions;
};

export const removeGameSessionSocket = (socket) => {
  for (const game of gameSessions) {
    const removedUser = game.removeUsersocket(socket); // 각 게임에서 소켓 기반 유저 제거
    if (removedUser) {
      break; // 유저를 찾으면 중단 (유저는 한 게임에만 존재한다고 가정)
    }
  }
}


