import { PacketType } from '../constants/header.js';
import gameEndHandler from '../handlers/game/gameEndhandler.js';
import {
  getAllGameSessions,
  getGameSessionBySocket,
  removeGameSession,
} from '../session/game.session.js';
import { removeUser } from '../session/user.session.js';
import { createResponse } from '../utils/response/createResponse.js';
import matchmakingQueue from '../classes/models/matchmaking.class.js';
import { gameSessions, userSessions } from '../session/sessions.js';

export const onEnd = (socket) => () => {
  // 유저 세션에서 해당 유저 제거
  const removedUser = removeUser(socket);
  if (!removedUser) {
    console.log('socket 안에 user를 찾을 수 없습니다.');
    return;
  }

  // 매칭 큐에서 유저 제거 및 매칭 중단
  if (matchmakingQueue.matchingUsers.has(removedUser.id)) {
    matchmakingQueue.stopMatching(removedUser.id);
  }
  matchmakingQueue.removeFromQueue(removedUser);

  console.log(`${removedUser.id} 가 userSessions에서 삭제되었습니다.`);

  // 게임 세션에서 해당 소켓이 속한 게임 찾기
  const gameSession = getGameSessionBySocket(socket);
  if (gameSession) {
    // 게임 세션에서 유저 제거
    gameSession.removeUserUserId(removedUser.id);
    console.log(`${removedUser.id} 가 게임 세션 ${gameSession.id} 에서 삭제되었습니다.`);

    // 남아 있는 유저 처리
    if (gameSession.users.length === 1) {
      const winner = gameSession.users[0];
      console.log(
        `
        [Notice]
         - 상대방과 연결이 끊어졌습니다. 
         - 남은 User : ${winner.id} 
         - 방 이름 : ${gameSession.id}
         `,
      );

      // 승리 메시지 전송
      const gameOverNotificationpayload = {
        isWin: true,
      };
      const packetType = PacketType.GAME_OVER_NOTIFICATION;
      const gameDisconnected = createResponse(packetType, gameOverNotificationpayload);
      // 비정상 게임 종료시 winner에게 승리 메시지 전송 = 승리 판정
      winner.socket.write(gameDisconnected);

      // 게임 상태를 종료로 변경
      gameSession.state = 'ended';
    }

    // 게임 세션이 비어 있으면 삭제
    if (gameSession.users.length === 0 || gameSession.state === 'ended') {
      console.log(
        `
        [Game Session : ${gameSession.id}]
         세션에 User가 존재하지 않습니다.
         세션을 삭제합니다...
         `,
      );
      removeGameSession(gameSession.id);
    }
  } else {
    console.log('No game session found for this socket.');
    console.log(`userSessions & gameSessions : ${userSessions}, ${gameSessions}`);
  }
};
