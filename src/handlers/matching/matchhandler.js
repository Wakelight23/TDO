import { PacketType } from '../../constants/header.js';
import { addGameSession, getAllGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { generateRandomMonsterPath } from '../../utils/monster/monsterPath.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import MatchmakingQueue from '../../classes/models/matchmaking.class.js';

// 전역 매칭큐 인스턴스 생성
const matchmakingQueue = new MatchmakingQueue();

const matchHandler = async ({ socket, sequence, payload }) => {
  //console.log('🚀 ~ matchHandler ~ socket:', socket);
  try {
    const {} = payload; //없음.?? 이게 왜없지. 아니 소켓으로 유저 찾아서 매칭해야하네.

    const user = getUserBySocket(socket);
    //console.log('🚀 ~ matchHandler ~ user:', user);
    //console.log('matchmakingQueue : ', matchmakingQueue);
    // 대기열에 추가
    matchmakingQueue.addToQueue(user);

    // 매칭 시도
    const matchedUser = matchmakingQueue.executeMatch(user);

    if (matchedUser) {
      // 게임 세션 생성 및 시작
      const gameId = uuidv4();
      const gameSession = addGameSession(gameId);

      // 몬스터 경로 생성 및 설정
      const path1 = generateRandomMonsterPath(340);
      const path2 = generateRandomMonsterPath(340);

      user.updateMonsterPaths(path1);
      matchedUser.updateMonsterPaths(path2);

      // 유저들을 게임 세션에 추가
      gameSession.addUser(user);
      gameSession.addUser(matchedUser);

      // 초기 타워 설정
      const tower1 = { x: 200, y: 340, towerId: gameSession.getPurchTowerConter() };
      const tower2 = { x: 200, y: 340, towerId: gameSession.getPurchTowerConter() };

      user.addTower(tower1);
      matchedUser.addTower(tower2);

      // 게임 시작
      gameSession.startGame();
    } else {
      // 매칭 대기 중임을 클라이언트에 알림
      // 패킷 타입 추가 필요
    }
  } catch (error) {
    console.error(error);
  }
};

export default matchHandler;
