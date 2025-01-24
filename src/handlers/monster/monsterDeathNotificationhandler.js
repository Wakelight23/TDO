import { PacketType } from '../../constants/header.js';
import {
  getJoinGameSessions,
  notificationGameSessionsBySocket,
} from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterDeathNotificationHandler = async ({ socket, sequence, payload }) => {
  try {
    let { monsterId } = payload; //소켓으로 유저 찾아서 매칭.


    //어떤 타워가 죽였는지에 따라 번호가 다릅니다. 100~999는 1, 1000~1999는 2, 2000~2999는 3, 3000~3999는 4로 나옵니다.
    const prefix = Math.floor(monsterId / 100000); 

    monsterId = monsterId % 100000;

    const user = getUserBySocket(socket);

    //유저가 가지고 있는 몬스터중 같은 아이디의 몬스터를 삭제시킵니다.
    user.removeMonster(monsterId);
    user.updateGold(user.getGold() + 10);
    user.updateScore(user.getScore() + 10);

    const gameSession = getJoinGameSessions(user);

    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    const enemyMonsterDeathNotificationpayload = {
      monsterId: monsterId,
    };
    const packetType = PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION;
    const enemyMonsterDeathNotificationResponse = createResponse(
      packetType,
      enemyMonsterDeathNotificationpayload,
      sequence,
    );
    enemyUser.socket.write(enemyMonsterDeathNotificationResponse);

    user.stateSyn();
    // notificationGameSessionsBySocket(socket);
  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathNotificationHandler;
