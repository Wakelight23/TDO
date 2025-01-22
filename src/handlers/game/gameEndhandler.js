import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';

const gameEndHandler = async ({ socket, sequence, payload }) => {
  try {
    const {} = payload;

    // userSessions에 socket에서 추출한 id를 확인
    const user = getUserBySocket(socket);

    // 현재 참가중인 게임 세션에서 user의 ID를 가져옴
    const gameSession = getJoinGameSessions(user);

    // 참가중인 게임 세션을 삭제
    gameSession.addDeleteAgreement();
    // user 정보 초기화
    user.clearUserData();
  } catch (error) {
    console.error(error);
  }
};

export default gameEndHandler;
