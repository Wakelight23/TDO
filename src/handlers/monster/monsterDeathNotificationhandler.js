import { PacketType } from '../../constants/header.js';
import { getGameSessionByUserSocket, notificationGameSessionsBySocket } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterDeathNotificationHandler = async ({ socket, sequence, payload }) => {
  try {
    const { monsterId } = payload; //소켓으로 유저 찾아서 매칭.

    const user = getUserBySocket(socket);

    //유저가 가지고 있는 몬스터중 같은 아이디의 몬스터를 삭제시킵니다.
    user.removeMonster(monsterId);
    user.updateGold(user.getGold() + 10);
    user.udateScore(user.getScore() + monsterId * 10);    

    const gameSession = getGameSessionByUserSocket(socket);

    const enemyUsers = gameSession.getOtherUserBySocket(socket);
    


    
    
    const enemyMonsterDeathNotificationpayload = {
      monsterId: monsterId,
    }
    const packetType = PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION;
    const enemyMonsterDeathNotificationResponse = createResponse(packetType, enemyMonsterDeathNotificationpayload, sequence);
    for(let enemyUser of enemyUsers)
    {
      enemyUser.socket.write(enemyMonsterDeathNotificationResponse);
    }


    notificationGameSessionsBySocket(socket);



  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathNotificationHandler;
