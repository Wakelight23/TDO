import { PacketType } from '../../constants/header.js';
import { addGameSession, getAllGameSessions, notificationGameSessionsBySocket } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { generateRandomMonsterPath } from '../../utils/monster/monsterPath.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

const matchHandler = async ({ socket, sequence, payload }) => {
  try {
    const {  } = payload; //없음.?? 이게 왜없지. 아니 소켓으로 유저 찾아서 매칭해야하네.


    const user = getUserBySocket(socket);
    //유저가 1명인 게임 세션을 찾아 봅니다.  
    let gameSession = getAllGameSessions().find((session) => session.users.length === 1);

    //몬스터 경로를 만들어 줍니다. 이때 y축 높이는 340을 중심으로 만들어 집니다.
    const path = generateRandomMonsterPath(340);
    //몬스터 경로를 유저에게 넣어 줍니다.
    user.updateMonsterPaths(path);

    //유저가 1명인 게임 세션이 있다면 게임을 시작합니다.
    if (gameSession) {
      gameSession.addUser(user);

      // 임시 타워 추가 없으면 클라에서 버그가 생깁니다.
      //타워 카운트 를 불러옵니다. 겹치는 번호가 없게 만듭니다.
      const towerId = gameSession.getPurchTowerConter();
      //위치는 변경해도 상관 없습니다. 여려개도 상관없슴.
      const tower = { x: 200, y:340, towerId:towerId };
      user.addTower(tower);

      gameSession.startGame();
    } else { //유저가 1명인 게임세션이 없다면 게임을 만들고 참여합니다.
      const gameId = uuidv4();
      gameSession = addGameSession(gameId);
      gameSession.addUser(user);

      // 임시 타워 추가 없으면 클라에서 버그가 생깁니다.
      //타워 카운트 를 불러옵니다. 겹치는 번호가 없게 만듭니다.
      const towerId = gameSession.getPurchTowerConter();
      //위치는 변경해도 상관 없습니다. 여려개도 상관없슴.
      const tower = { x: 200, y:340, towerId:towerId };
      user.addTower(tower);
      
    }
    

  } catch (error) {
    console.error(error);
  }
};

export default matchHandler;
