import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterDeathNotificationHandler = async ({ socket, sequence, payload }) => {
  try {
    const { monsterId } = payload; //소켓으로 유저 찾아서 매칭.


    
    
    // 대칭상대 몬스터 사망 동기화.
    //const enemyMonsterDeathNotificationpayload = {
    //  monsterId: 100,
    //}
    //const packetType = PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION;
    //const enemyMonsterDeathNotificationResponse = createResponse(packetType, enemyMonsterDeathNotificationpayload, sequence);
    //socket.write(enemyMonsterDeathNotificationResponse);

  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathNotificationHandler;
