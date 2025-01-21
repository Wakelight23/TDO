import { getJoinGameSessions } from "../../session/game.session.js";
import { getUserBySocket } from "../../session/user.session.js";

const gameEndHandler = async ({ socket, sequence, payload }) => {
  try {
    const { } = payload; 

    const user = getUserBySocket(socket);

    const gameSession = getJoinGameSessions(user);
    
    gameSession.addDeleteAgreement();
    user.clearUserData();
    
  } catch (error) {
    console.error(error);
  }
};

export default gameEndHandler;
