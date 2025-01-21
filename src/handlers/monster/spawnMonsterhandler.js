import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getGameSessionByUserSocket } from '../../session/game.session.js';

const spawnMonsterHandler = async ({ socket, sequence, payload }) => {
  try {
    const { } = payload; //소켓으로 유저 찾아서 매칭.
    //몬스터의 id
    //생성될 몬스터의 타입
    const spawnMonsterType = Math.ceil(Math.random()*5);
    

    //게임 내 세션에서 monsterNumber를 읽고 최대 숫자만큼을 받아오도록 한다.
    //monsterId : 몬스터의 고유 값, monsterNumber = 몬스터의 종류(1~5);
    const spawnMonsterpayload = {
        monsterId,
        monsterNumber: spawnMonsterType
    };

    //현재 플레이어가 속해 있는 게임 세션을 가져오기
    const gamesession = getGameSessionByUserSocket(socket);
    const otherSocketList = gamesession.getOtherUserBySocket(socket).map((user)=>user.socket);
    

    const packetType = PacketType.SPAWN_MONSTER_RESPONSE;
    const spawnMonsterResponse = createResponse(packetType, spawnMonsterpayload, sequence);
    socket.write(spawnMonsterResponse);

    
    // 대칭상대 몬스터 스폰 동기화. 상대가 spawnMonsterHandler를 받았을때 보내면 됨.
    const spawnEnemyMonsterNotificationpayload = {
     monsterId,
     monsterNumber: spawnMonsterType,
    }
    const otherPlayerpacketType = PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION;
    const spawnEnemyMonsterNotificationResponse = createResponse(otherPlayerpacketType, spawnEnemyMonsterNotificationpayload, sequence);
    for(let otherSocket of otherSocketList)
    {
      otherSocket.write(spawnEnemyMonsterNotificationResponse);
    }
    

    

  } catch (error) {
    console.error(error);
  }
};

export default spawnMonsterHandler;
