import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (socket, highscore, id) => {
  const user = new User(socket, highscore, id);
  userSessions.push(user);
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
  return userSessions.some((user) => user.id === id); // userSessions 배열에서 id가 일치하는 사용자가 있는지 확인
};
