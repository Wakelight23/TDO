import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterAttackBaseHandler = async ({ socket, sequence, payload }) => {
  try {
    const { damage } = payload; //소켓으로 유저 찾아서 매칭.


    

    
    const updateBaseHPNotificationpayload = {
      isOpponent: true, // HP를 업데이트 할 기지가 상대방 기지라면 true
      baseHp: 100,
    };
    const packetType = PacketType.UPDATE_BASE_HP_NOTIFICATION;
    const updateBaseHPNotificationResponse = createResponse(packetType, updateBaseHPNotificationpayload, sequence);
    socket.write(updateBaseHPNotificationResponse);


    // baseHp가 0이 됬을때 보내주는것. 서로에게 보내줘야함. 
    //const gameOverNotificationpayload = {
    //  isWin = true; // 받는 플레이어가 승리했으면 true
    //}
    //const packetType = PacketType.GAME_OVER_NOTIFICATION;
    //const sgameOverNotificationResponse = createResponse(packetType, gameOverNotificationpayload, sequence);
    //socket.write(sgameOverNotificationResponse);

  } catch (error) {
    console.error(error);
  }
};

export default monsterAttackBaseHandler;
