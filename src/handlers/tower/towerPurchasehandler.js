import { PacketType } from '../../constants/header.js';
import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

//타워 구매 위치
const towerPurchaseHandler = async ({ socket, sequence, payload }) => { //일단.. 타워 코스트 추가해야함.
  try {
    const { x , y } = payload; 

    const user = getUserBySocket(socket);

    const gameSessions = getJoinGameSessions(user);

    let usergold = user.getGold();
    user.updateGold(usergold-10);

    const towerId = gameSessions.getPurchTowerConter();

    const tower = { towerId:towerId, x:x, y:y };

    user.addTower(tower);
    
    //타워 구매 아이디 부여.
    const towerPurchasepayload = {
      towerId: towerId,
    };

    let packetType = PacketType.TOWER_PURCHASE_RESPONSE;
    const towerPurchaseResponse = createResponse(packetType, towerPurchasepayload, sequence);
    socket.write(towerPurchaseResponse);

    // 상대에게 구매했을때 보내주는 것 (적 타워의 동기화).
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    const addEnemyTowerNotificationpayload = {
      towerId: towerId,
      x: x,
      y: y,
    }
    packetType = PacketType.ADD_ENEMY_TOWER_NOTIFICATION;
    const saddEnemyTowerNotificationResponse = createResponse(packetType, addEnemyTowerNotificationpayload, sequence);
    enemyUser.socket.write(saddEnemyTowerNotificationResponse);

  } catch (error) {
    console.error(error);
  }
};

export default towerPurchaseHandler;
