import { PacketType } from '../../constants/header.js';
import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const spawnMonsterHandler = async ({ socket, sequence, payload }) => {
  try {
    const { } = payload; 

    const user = getUserBySocket(socket);

    //유저가 참여하고 있는 게임 세션을 가져옵니다.
    const gameSessions = getJoinGameSessions(user);

    //게임 세션의 몬스터 스폰 카운트를 가져옵니다. 
    //이 함수는 가져올때마다 세션의 몬스터 카운트가 하나씩 증가해 중복되지 않게 해줍니다.
    const monsterId = gameSessions.getSpawnMonsterCounter();
    
    //1~5까지 랜덤으로 뽑아줍니다. 몬스터 외형과 스테이터스를 정해줍니다.(정확한 수치는 모름)
    const monsterNumber = Math.floor(Math.random()*(4))+ 1 ;

    //몬스터 객체를 만들어 줍니다. 반드시 이 형태로 만들어야 합니다. 
    const monster = { monsterId , monsterNumber, level:gameSessions.monsterLevel };

    //몬스터를 유저에게 넣어줍니다.
    user.addMonster(monster);
    
    //그뒤 클라에게 몬스터 스폰을 줍니다.
    const spawnMonsterpayload = {
        monsterId,
        monsterNumber,
    };
    let packetType = PacketType.SPAWN_MONSTER_RESPONSE;
    const spawnMonsterResponse = createResponse(packetType, spawnMonsterpayload, sequence);
    socket.write(spawnMonsterResponse);



    //상대한테 내 몬스터 나왔다고 보네기.
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());

    const spawnEnemyMonsterNotificationpayload = {
      monsterId,
      monsterNumber,
    }
    packetType = PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION;
    const spawnEnemyMonsterNotificationResponse = createResponse(packetType, spawnEnemyMonsterNotificationpayload, sequence);
    enemyUser.socket.write(spawnEnemyMonsterNotificationResponse);
    
  } catch (error) {
    console.error(error);
  }
};

export default spawnMonsterHandler;
