import { PacketType } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterAttackBaseHandler = async ({ socket, sequence, payload }) => {
  try {
    const { damage } = payload; //소켓으로 유저 찾아서 매칭.
    
    const user = getUserBySocket(socket);
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    user.updateBase(user.base.hp - damage);


    if(user.base.hp <= 0 ) {

      const gameOverNotificationpayload = {
          isWin: false, 
        }
        const packetType = PacketType.GAME_OVER_NOTIFICATION;
        const sgameOverNotificationResponse = createResponse(packetType, gameOverNotificationpayload, sequence);
        socket.write(sgameOverNotificationResponse);
      
      const enemygameOverNotificationpayload = {
          isWin: true, 
        }
        const enemysgameOverNotificationResponse = createResponse(packetType, enemygameOverNotificationpayload, sequence);
        enemyUser.socket.write(enemysgameOverNotificationResponse);
      } else {
        const updateBaseHPNotificationpayload = {
          isOpponent: false, 
          baseHp: user.base.hp,
        };
        const packetType = PacketType.UPDATE_BASE_HP_NOTIFICATION;
        const updateBaseHPNotificationResponse = createResponse(packetType, updateBaseHPNotificationpayload, sequence);
        socket.write(updateBaseHPNotificationResponse);
    
        // 동기화 ㅋㅋ
        const enemyupdateBaseHPNotificationpayload = {
          isOpponent: true, 
          baseHp: user.base.hp,
        };
        const enemyupdateBaseHPNotificationResponse = createResponse(packetType, enemyupdateBaseHPNotificationpayload, sequence);
        enemyUser.socket.write(enemyupdateBaseHPNotificationResponse);
      }


  } catch (error) {
    console.error(error);
  }
};

export default monsterAttackBaseHandler;
