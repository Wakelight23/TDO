import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import matchmakingQueue from '../../classes/models/matchmaking.class.js';

const matchHandler = async ({ socket, sequence, payload }) => {
  try {
    // isMatchable true - 매치 / false - 매치 취소
    const { isMatchable } = payload;

    const user = getUserBySocket(socket);

    if (isMatchable) {
      // 이미 게임 중인 유저인지 확인
      const gameSession = getJoinGameSessions(user);
      if (gameSession) {
        console.log(`${user.id} 님은 이미 게임 중입니다.`);
        return;
      }

      // 대기열에 추가
      const addedToQueue = matchmakingQueue.addToQueue(user);
      //console.log('\n🚀 ~ matchHandler ~ addedToQueue:', addedToQueue);

      // 대기열에 추가되었을 경우 매칭 시작
      if (addedToQueue) {
        const waitingUsersInfo = matchmakingQueue.waitingUsers.map(({ user }) => ({
          id: user.id,
          highscore: user.highscore,
        }));

        console.log('\n🚀 ~ matchHandler ~ waiting users:', waitingUsersInfo);

        matchmakingQueue.startMatching(user);
      }
    } else {
      matchmakingQueue.stopMatching(user.id);
    }
  } catch (error) {
    console.error(error);
  }
};

export default matchHandler;
