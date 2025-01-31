import { PacketType } from '../../constants/header.js';
import { notificationGameSessionsBySocket } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

//packetType : 16
const monsterAttackBaseHandler = async ({ socket, sequence, payload }) => {
  try {
    const { damage } = payload; //소켓으로 유저 찾아서 매칭.

    const user = getUserBySocket(socket);
    // 유저에게 저장된 상대 유저의 소켓으로 상대 유저를 찾습니다.
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    if (!enemyUser) {
      return;
    }
    //음수값의 수치가 있을 수 있으니까?
    if (damage < 0) {
      damage = 0;
    }

    user.updateBase(user.base.hp - damage);
    //충돌했을 때 돈은 분명 더 줘야지 제대로 처리할 수 있을 것으로 생각된다.
    user.updateGold(user.getGold() - 10 > 0 ? user.getGold() : 0);

    if (user.base.hp <= 0) {
      //이때 베이스 체력이 0보다 낮아진다면.

      // 유저(지금 보내고 있는)의 베이스가 0이므로 패배 처리를 해줍니다.isWin이 false면 패배입니다.
      const gameOverNotificationpayload = {
        isWin: false,
      };
      const packetType = PacketType.GAME_OVER_NOTIFICATION;
      const sgameOverNotificationResponse = createResponse(
        packetType,
        gameOverNotificationpayload,
        sequence,
      );
      socket.write(sgameOverNotificationResponse);

      //그 뒤 상대 유저에게는 승리 처리를 해줍니다. isWin이 true면 승리입니다.
      const enemygameOverNotificationpayload = {
        isWin: true,
      };
      const enemysgameOverNotificationResponse = createResponse(
        packetType,
        enemygameOverNotificationpayload,
        sequence,
      );
      //상대 유저 소캣으로 보내줍니다.
      enemyUser.socket.write(enemysgameOverNotificationResponse);
    } else {
      //베이스가 0이 아니라면 업데이트 시켜줍니다. isOpponent이 false 면 유저의 베이스의 체력이 업데이트 됩니다. 모르겠으면 true로 바꿔봅시다.
      const updateBaseHPNotificationpayload = {
        isOpponent: false,
        baseHp: user.base.hp,
      };
      const packetType = PacketType.UPDATE_BASE_HP_NOTIFICATION;
      const updateBaseHPNotificationResponse = createResponse(
        packetType,
        updateBaseHPNotificationpayload,
        sequence,
      );
      socket.write(updateBaseHPNotificationResponse);

      // 상대 유저에게 보내주는 겁니다. 상대 유저의 화면에 보이는 베이스의 체력을 업데이트 시켜 줍니다.
      const enemyupdateBaseHPNotificationpayload = {
        isOpponent: true,
        baseHp: user.base.hp,
      };
      const enemyupdateBaseHPNotificationResponse = createResponse(
        packetType,
        enemyupdateBaseHPNotificationpayload,
        sequence,
      );
      //상대 유저 소캣으로 보내줍니다.
      enemyUser.socket.write(enemyupdateBaseHPNotificationResponse);
    }

    //일단 동기화를 이렇게 처리하도록 하자
    notificationGameSessionsBySocket(socket);
  } catch (error) {
    console.error(error);
  }
};

export default monsterAttackBaseHandler;
