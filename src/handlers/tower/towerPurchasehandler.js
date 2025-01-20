import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

//타워 구매 위치
const towerPurchaseHandler = async ({ socket, sequence, payload }) => {
  try {
    const { x , y } = payload; 


    
    //타워 구매 아이디 부여.
    const towerPurchasepayload = {
      towerId: 100,
    };

    const packetType = PacketType.TOWER_PURCHASE_RESPONSE;
    const towerPurchaseResponse = createResponse(packetType, towerPurchasepayload, sequence);
    socket.write(matchStartResponse);

    // 이건 적이 타워를 구매했을때 보내주는 것 (적 타워의 동기화).
    //const addEnemyTowerNotificationpayload = {
    //  towerId: 100,
    //  x: 0.1,
    //  y: 0.1,
    //}
    //const packetType = PacketType.ADD_ENEMY_TOWER_NOTIFICATION;
    //const saddEnemyTowerNotificationResponse = createResponse(packetType, addEnemyTowerNotificationpayload, sequence);


  } catch (error) {
    console.error(error);
  }
};

export default towerPurchaseHandler;
