import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (socket, highscore, id) => {
  const user = new User(socket, highscore, id);
  userSessions.push(user);
  console.log('addUser 안에 있는 userSessions : ', userSessions);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

// export const getUserById = (id) => {
//   return userSessions.find((user) => user.id === id);
// };

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getUser = () => {
  return userSessions;
};

export const isUserLoggedIn = (id) => {
  // 로그인된 사용자 세션 배열에서 해당 id를 가진 사용자가 있는지 확인
  return userSessions.some((user) => user.id === id);
};
