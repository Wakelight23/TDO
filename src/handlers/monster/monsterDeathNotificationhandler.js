import { PacketType } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterDeathNotificationHandler = async ({ socket, sequence, payload }) => {
  try {
    const { monsterId } = payload; //소켓으로 유저 찾아서 매칭.

    const user = getUserBySocket(socket);

    user.removeMonster(monsterId);

    const enemyUser = getUserBySocket(user.getMatchingUsersocket());


    
    
    const enemyMonsterDeathNotificationpayload = {
      monsterId: monsterId,
    }
    const packetType = PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION;
    const enemyMonsterDeathNotificationResponse = createResponse(packetType, enemyMonsterDeathNotificationpayload, sequence);
    enemyUser.socket.write(enemyMonsterDeathNotificationResponse);

  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathNotificationHandler;
