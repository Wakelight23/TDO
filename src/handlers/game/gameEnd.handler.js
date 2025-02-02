import { updateDBHighScore } from '../../db/user/user.db.js';
import {
  getGameSessionBySocket,
  getJoinGameSessions,
  removeGameSession,
} from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';

const gameEndHandler = async ({ socket, sequence, payload }) => {
  try {
    // 소켓에서 사용자 정보 가져오기
    const user = getUserBySocket(socket);

    if(!user)
    {
      return;
    }
    
    // console.log('gameEndHandler의 user 확인 : \n', user);

    // 현재 참가 중인 게임 세션 가져오기
    const gameSession = getJoinGameSessions(user);

    if(!gameSession)
    {
      return;
    }

    console.log('user.score : ', user.score);
    console.log('user.highscore : ', user.highscore);

    // 새로운 점수가 기존 highScore보다 높은지 확인
    if (user.score > user.highscore) {
      console.log(`신기록 달성! : ${user.score}`);
      // DB에 새로운 highScore 업데이트
      await updateDBHighScore(user.id, user.score);
      // 메모리 상의 사용자 highScore도 업데이트
      user.highscore = user.score;
      // user.updateHighScore(user.highScore);
    }

    // 참가 중인 게임 세션 삭제
    // 게임 세션에서 해당 소켓이 속한 게임 찾기
    const deleteGameSession = getGameSessionBySocket(socket);
    if (deleteGameSession && deleteGameSession.users.length === 2) {
      // 게임 세션에서 유저 제거
      deleteGameSession.removeUserUserId(user.id);
      console.log(`${user.id} 가 게임 세션 ${deleteGameSession.id} 에서 삭제되었습니다.`);

      // 게임 상태를 종료로 변경
      deleteGameSession.state = 'ended';
      // 게임 세션이 비어 있으면 삭제
      if (deleteGameSession.state === 'ended') {
        console.log(
          `
        [Game Session : ${deleteGameSession.id}]
         게임이 종료되었습니다...
         세션을 삭제합니다.
        `,
        );
        removeGameSession(deleteGameSession.id);
      }
    }

    // 사용자 정보 초기화
    user.clearUserData();
  } catch (error) {
    console.error(error);
  }
};

export default gameEndHandler;
