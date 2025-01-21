import { PacketType } from '../../constants/header.js';
import { getGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterAttackBaseHandler = async ({ socket, sequence, payload }) => {
  try {
    const { damage } = payload; //소켓으로 유저 찾아서 매칭.

    //현재 플레이어의 데이터를 어떻게 받아올 것이며 그걸 기반으로 출력을 어떻게 할 것인가.

    //일단 이런 식으로 게임 세션을 받아왔다고 쳐보자.
    const gamesession = getGameSession(1);//여기에는 현재 플레이어의 ID를 입력한다. jwt 토큰이 될 것으로 보인다.

    //다음 그 내부에서 플레이어 정보를 찾아온다.
    const user = gamesession.getUser("적당히 유저 아이디");//이런 식으로 유저 아이디를 찾아왔다고 해보자.


    

    
    const updateBaseHPNotificationpayload = {
      isOpponent: true, // HP를 업데이트 할 기지가 상대방 기지라면 true
      baseHp: user.hp,
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
