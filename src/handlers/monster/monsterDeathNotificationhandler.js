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

    //2가 골드 많이 주는 거 4가 스코어 많이 주는 걸로 하자.

    monsterId = monsterId % 100000;

    const user = getUserBySocket(socket);

    //유저가 가지고 있는 몬스터중 같은 아이디의 몬스터를 삭제시킵니다.
    //pointMuitiplier : 레벨 값에 따라서 현재 얻을 포인트 값을 곱해서 리턴한다.
    user.removeMonster(monsterId);

    //타워의 타입에 따라서 골드와 스코어를 올리는 방법을 분리해보자.
    switch (prefix) {
      case 1://기본 타워
        user.updateGold(user.getGold() + user.pointMultiplier(10));
        user.updateScore(user.getScore() + user.pointMultiplier(10));
        break;
      case 2://골드 더 주는 타워'
        user.updateGold(user.getGold() + user.pointMultiplier(30));
        user.updateScore(user.getScore() + user.pointMultiplier(10));
        break;
      case 3://스코어 더 주는 타워
        user.updateGold(user.getGold() + user.pointMultiplier(10));
        user.updateScore(user.getScore() + user.pointMultiplier(30));
        break;
      case 4://둘 다 더 주는 타워
        user.updateGold(user.getGold() + user.pointMultiplier(20));
        user.updateScore(user.getScore() + user.pointMultiplier(20));
        break;

    }


    //const gameSession = getJoinGameSessions(user);

    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    const enemyMonsterDeathNotificationpayload = {
      monsterId: monsterId,
    };

    const userPacketType = PacketType.MONSTER_DEATH_NOTIFICATION;

    const monsterDeathNotificationResponse = createResponse(
      userPacketType,
      enemyMonsterDeathNotificationpayload,
      sequence
    )

    user.socket.write(monsterDeathNotificationResponse);

    const packetType = PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION;
    const enemyMonsterDeathNotificationResponse = createResponse(
      packetType,
      enemyMonsterDeathNotificationpayload,
      sequence,
    );
    //user.socket.write(enemyMonsterDeathNotificationResponse);
    enemyUser.socket.write(enemyMonsterDeathNotificationResponse);

    user.stateSyn();
    enemyUser.stateSyn();
    // notificationGameSessionsBySocket(socket);
  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathNotificationHandler;
