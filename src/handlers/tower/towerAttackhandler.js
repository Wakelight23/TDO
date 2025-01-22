import { PacketType } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

//타워가 몬스터를 때림.
const towerAttackHandler = async ({ socket, sequence, payload }) => {
  try {
    const { towerId, monsterId } = payload;

    if (typeof towerId !== 'number' || towerId < 100) {
      throw new Error('towerId는 100 이상의 숫자여야 합니다.');
    }

    if (typeof monsterId !== 'number' || monsterId < 10000) {
      throw new Error('monsterId는 10000 이상의 숫자여야 합니다.');
    }

    const user = getUserBySocket(socket);
    if (!user) {
      throw new Error('유저를 찾을 수 없습니다.');
    }
    // 유저에게 저장된 상대 유저의 소켓으로 상대 유저를 찾습니다.
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());
    if (!enemyUser) {
      throw new Error('상대 유저를 찾을 수 없습니다.');
    }
    // 상대 유저에게 이 타워가 저 몬스터를 때렸다고 알려줍니다. 그럼 클라에서 때림.
    const enemyTowerAttackNotificationpayload = {
      towerId: towerId,
      monsterId: monsterId,
    };
    const packetType = PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION;

    const enemyTowerAttackNotificationResponse = createResponse(
      packetType,
      enemyTowerAttackNotificationpayload,
      sequence,
    );
    enemyUser.socket.write(enemyTowerAttackNotificationResponse);
    // ^상대 유저에게 보냅니다. 모르겠으면 안보내 보면 됨.
  } catch (error) {
    console.error(error);
  }
};

export default towerAttackHandler;
