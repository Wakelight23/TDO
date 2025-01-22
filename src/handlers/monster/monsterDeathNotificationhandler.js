import { PacketType } from '../../constants/header.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const monsterDeathNotificationHandler = async ({ socket, sequence, payload }) => {
  try {
    const { monsterId } = payload; //소켓으로 유저 찾아서 매칭.

    const user = getUserBySocket(socket);

    //유저가 가지고 있는 몬스터중 같은 아이디의 몬스터를 삭제시킵니다.
    user.removeMonster(monsterId);

    //점수추가, 골드 추가등을 
    //user.getGold()--> 현재 골드 가져옴, 
    //user.updategold(n) --> 골드를 n으로 업데이트 해줌. 
    //user.getScore()--> ...
    //user.updateScore(score) --> .. 등으로 업데이트 시켜준 뒤.

    ////유저가 참여하고 있는 게임 세션을 가져옵니다.
    // const gameSessions = getJoinGameSessions(user);  이걸 통해 게임 세션을 가져오고.
    // gameSessions.stateSyn(); 를 사용하면 클라이언트에 골드, 점수가 업데이트 됩니다.





     // 유저에게 저장된 상대 유저의 소켓으로 상대 유저를 찾습니다. 
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());
     
    //상대 유저에서 몬스터를 삭제시킵니다. 어떻게 작동되는지 모르겠으면 밑에 소켓 쓰는 부분을 주석처리 해보면 됩니다.
    const enemyMonsterDeathNotificationpayload = {
      monsterId: monsterId,
    }
    const packetType = PacketType.ENEMY_MONSTER_DEATH_NOTIFICATION;
    const enemyMonsterDeathNotificationResponse = createResponse(packetType, enemyMonsterDeathNotificationpayload, sequence); 
    enemyUser.socket.write(enemyMonsterDeathNotificationResponse);
    //^^^모르겠으면 위에 이거 주석처리.
  } catch (error) {
    console.error(error);
  }
};

export default monsterDeathNotificationHandler;
