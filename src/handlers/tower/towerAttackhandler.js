import { PacketType } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

//타워가 몬스터를 때림.
const towerAttackHandler = async ({ socket, sequence, payload }) => {
  try {
    const { towerId , monsterId } = payload; 

    const user = getUserBySocket(socket);
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    const enemyTowerAttackNotificationpayload = {
      towerId: towerId,
      monsterId: monsterId
    };
    const packetType = PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION;
    const enemyTowerAttackNotificationResponse = createResponse(packetType, enemyTowerAttackNotificationpayload, sequence);
    enemyUser.socket.write(enemyTowerAttackNotificationResponse);

  } catch (error) {
    console.error(error);
  }
};

export default towerAttackHandler;
