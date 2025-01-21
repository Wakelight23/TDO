import { PacketType } from '../../constants/header.js';
import { addGameSession, getAllGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { generateRandomMonsterPath } from '../../utils/monster/monsterPath.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

const matchHandler = async ({ socket, sequence, payload }) => {
  try {
    const {  } = payload; //없음.?? 이게 왜없지. 아니 소켓으로 유저 찾아서 매칭해야하네.


    const user = getUserBySocket(socket);
    let gameSession = getAllGameSessions().find((session) => session.users.length === 1);

    const path = generateRandomMonsterPath(340);
    user.updateMonsterPaths(path);

    if (gameSession) {
      gameSession.addUser(user);

      // 임시 타워 추가
      const towerId = gameSession.getPurchTowerConter();
      const tower = { x: 200, y:340, towerId:towerId };
      user.addTower(tower);

      gameSession.startGame();
    } else {
      const gameId = uuidv4();
      gameSession = addGameSession(gameId);
      gameSession.addUser(user);

      // 임시 타워 추가
      const towerId = gameSession.getPurchTowerConter();
      const tower = { x: 200, y:340, towerId:towerId };
      user.addTower(tower);
      
    }
    

  } catch (error) {
    console.error(error);
  }
};

export default matchHandler;
