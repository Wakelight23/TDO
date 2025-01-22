import { updateDBHighScore } from '../../db/user/user.db.js';
import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';

const gameEndHandler = async ({ socket, sequence, payload }) => {
  try {
    // 소켓에서 사용자 정보 가져오기
    const user = getUserBySocket(socket);
    console.log('gameEndHandler의 user 확인 : \n', user);

    // 현재 참가 중인 게임 세션 가져오기
    const gameSession = getJoinGameSessions(user);

    // 새로운 점수가 기존 highScore보다 높은지 확인
    if (user.score > user.highScore) {
      console.log(`신기록 달성! : ${user.score}`);

      // console.log('변수 확인 user.score, user.id', user.score, user.id);

      // DB에 새로운 highScore 업데이트
      // await updateDBHighScore(user.id, user.score);

      // 메모리 상의 사용자 highScore도 업데이트
      // user.highScore = user.score;
    }

    // 참가 중인 게임 세션 삭제
    gameSession.addDeleteAgreement();

    // 사용자 정보 초기화
    user.clearUserData();
  } catch (error) {
    console.error(error);
  }
};

export default gameEndHandler;
