import { PacketType } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterDeathNotificationHandler = async ({ socket, sequence, payload }) => {
  try {
    let { monsterId } = payload; //소켓으로 유저 찾아서 매칭.

    //어떤 타워가 죽였는지에 따라 번호가 다릅니다. 100~999는 1, 1000~1999는 2, 2000~2999는 3, 3000~3999는 4로 나옵니다.
    const prefix = Math.floor(monsterId / 100000);

    const user = getUserBySocket(socket);

    if (!user) {
      return;
    }

    monsterId = monsterId % 100000;

    // 유저가 가지고 있는 몬스터중 같은 아이디의 몬스터를 삭제시킵니다.
    // pointMuitiplier : 레벨 값에 따라서 현재 얻을 포인트 값을 곱해서 리턴한다.
    user.removeMonster(monsterId);

    //타워의 타입에 따라서 골드와 스코어를 올리는 방법을 분리해보자.
    switch (prefix) {
      case 1: //기본 타워
        user.updateGold(user.getGold() + 5);
        user.updateScore(user.getScore() + 10);
        break;
      case 2: //골드 더 주는 타워'
        user.updateGold(user.getGold() + 15);
        user.updateScore(user.getScore() + 10);
        break;
      case 3: //스코어 더 주는 타워
        user.updateGold(user.getGold() + 5);
        user.updateScore(user.getScore() + 30);
        break;
      case 4: //둘 다 더 주는 타워
        user.updateGold(user.getGold() + 10);
        user.updateScore(user.getScore() + 20);
        break;
    }

    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    if (!enemyUser) {
      return;
    }

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

    // 자신의 상태 동기화
    user.stateSyn();
    // 상대방 상태 동기화
    enemyUser.stateSyn();
  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathNotificationHandler;
