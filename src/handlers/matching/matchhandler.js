import { PacketType } from '../../constants/header.js';
import {
  addGameSession,
  getAllGameSessions,
  getJoinGameSessions,
  notificationGameSessionsBySocket,
} from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { generateRandomMonsterPath } from '../../utils/monster/monsterPath.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';
import MatchmakingQueue from '../../classes/models/matchmaking.class.js';

// 전역 매칭큐 인스턴스 생성
const matchmakingQueue = new MatchmakingQueue();

const matchHandler = async ({ socket, sequence, payload }) => {
  try {
    const user = getUserBySocket(socket);

    // 이미 게임 중인 유저인지 확인
    const gameSession = getJoinGameSessions(user);
    if (gameSession) {
      console.log(`${user.id} 님은 이미 게임 중입니다.`);
      return;
    }

    // 대기열에 추가
    matchmakingQueue.addToQueue(user);
    console.log('\n🚀 ~ matchHandler ~ add to waiting users:', matchmakingQueue.waitingUsers);

    // 주기적 매칭 시작
    matchmakingQueue.startMatching(user);
  } catch (error) {
    console.error(error);
  }
};

export default matchHandler;
