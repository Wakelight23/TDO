import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

//타워가 몬스터를 때림.
const towerAttackHandler = async ({ socket, sequence, payload }) => {
  try {
    const { towerId , monsterId } = payload; 


    
    //대충 만든 상대 유저를 얻는 함수. 안만듬.--> 어떻게 찾아도 상관x
    //anemyUser = getAnemyUser(socket);

    //이 페이로드는 적 타워가 몬스터를 때리는걸 보낸것. 즉 이건 상대쪽에게 보내야함.
    //즉 지금 보내는건 저 타워 어택 핸들러를 받았을때 보내는게 아니고. 
    //상대 유저가 타워어택 핸들러를 받았을때 보내는것.
    const enemyTowerAttackNotificationpayload = {
      towerId: 100,
      monsterId: 100,
    };
    const packetType = PacketType.ENEMY_TOWER_ATTACK_NOTIFICATION;
    const enemyTowerAttackNotificationResponse = createResponse(packetType, enemyTowerAttackNotificationpayload, sequence);
    //anemyUser.socket.write(enemyTowerAttackNotificationResponse);

  } catch (error) {
    console.error(error);
  }
};

export default towerAttackHandler;
