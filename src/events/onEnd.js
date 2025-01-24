import {
  getAllGameSessions,
  getGameSessionBySocket,
  removeGameSession,
} from '../session/game.session.js';
import { removeUser } from '../session/user.session.js';

export const onEnd = (socket) => () => {
  // 유저 세션에서 해당 유저 제거
  const removedUser = removeUser(socket);
  if (!removedUser) {
    console.log('socket 안에 user를 찾을 수 없습니다.');
    return;
  }

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
        `상대방과 연결이 끊어졌습니다. 남은 User : ${winner.id} 방 이름 : ${gameSession.id}`,
      );

      // 승리 메시지 전송
      winner.socket.write(
        JSON.stringify({
          type: 'S2CGameOverNotification',
          isWin: true,
        }),
      );

      // 게임 상태를 종료로 변경
      gameSession.state = 'ended';
    }

    // 게임 세션이 비어 있으면 삭제
    if (gameSession.users.length === 0) {
      console.log(`Game session ${gameSession.id} is now empty and will be removed.`);
      removeGameSession(gameSession.id);
    }
  } else {
    console.log('No game session found for this socket.');
  }
};
