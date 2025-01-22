import { getJoinGameSessions } from "../../session/game.session.js";
import { getUserBySocket } from "../../session/user.session.js";

const gameEndHandler = async ({ socket, sequence, payload }) => {
  try {
    const { } = payload; 

    const user = getUserBySocket(socket);

    const gameSession = getJoinGameSessions(user);
    

    //삭제 변수를 1 추가합니다. 2가되면 게임이 삭제됩니다.
    gameSession.addDeleteAgreement();

    //유저 정보를 초기화(하이스코어 제외),합니다.
    user.clearUserData();
    
  } catch (error) {
    console.error(error);
  }
};

export default gameEndHandler;
