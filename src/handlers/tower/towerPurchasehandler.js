import { PacketType } from '../../constants/header.js';
import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

//타워 구매 위치
const towerPurchaseHandler = async ({ socket, sequence, payload }) => { //일단.. 타워 코스트 추가해야함.
  try {
    const { x , y } = payload; 

    const user = getUserBySocket(socket);

    //유저가 참여하고 있는 게임세션을 가져옵니다. 
    const gameSessions = getJoinGameSessions(user);

    //유저 골드를 업데이트 시켜줍니다. 게임 세션에서 타워코스트를 관리한다면 gameSessions.towercost로 할수 있을거 같다.
    let usergold = user.getGold();
    // 타워 코스트가 10이라 그냥 적은것.
    user.updateGold(usergold-10); 

    //user.getGold()--> 현재 골드 가져옴, 
    //user.updategold(n) --> 골드를 n으로 업데이트 해줌. 
    //gameSessions.stateSyn(); 를 사용하면 클라이언트에 골드, 점수가 업데이트 됩니다.



    //타워 카운터를 가져옵니다. 가져올때마다 1씩 증가하여, 중복되지 않도록 해줍니다.
    const towerId = gameSessions.getPurchTowerConter();

    //타워 객체는 반드시 이런 형태여야 합니다.
    const tower = { towerId:towerId, x:x, y:y };

    user.addTower(tower);
    
    //타워 구매 아이디 부여.
    const towerPurchasepayload = {
      towerId: towerId,
    };

    let packetType = PacketType.TOWER_PURCHASE_RESPONSE;
    const towerPurchaseResponse = createResponse(packetType, towerPurchasepayload, sequence);
    socket.write(towerPurchaseResponse);

    // 상대에게 구매했다는걸 보내주는 것 (타워의 동기화).
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    const addEnemyTowerNotificationpayload = {
      towerId: towerId,
      x: x,
      y: y,
    }
    packetType = PacketType.ADD_ENEMY_TOWER_NOTIFICATION;
    const saddEnemyTowerNotificationResponse = createResponse(packetType, addEnemyTowerNotificationpayload, sequence);
    enemyUser.socket.write(saddEnemyTowerNotificationResponse);
    // ^모르겠으면 주석처리 해보기

  } catch (error) {
    console.error(error);
  }
};

export default towerPurchaseHandler;
