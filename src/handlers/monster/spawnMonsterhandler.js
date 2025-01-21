import { random } from 'lodash';
import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getGameSessionByUserSocket } from '../../session/game.session.js';

const spawnMonsterHandler = async ({ socket, sequence, payload }) => {
  try {
    const { } = payload; //소켓으로 유저 찾아서 매칭.
    

    //게임 내 세션에서 monsterNumber를 읽고 최대 숫자만큼을 받아오도록 한다.
    const spawnMonsterpayload = {
        monsterId: 100,
        monsterNumber: 100,
    };

    //현재 플레이어가 속해 있는 게임 세션을 가져오기
    const gamesession = getGameSessionByUserSocket(socket);
    const otherSocketList = gamesession.getOtherUserBySocket(socket).map((user)=>user.socket);
    

    const packetType = PacketType.SPAWN_MONSTER_RESPONSE;
    const spawnMonsterResponse = createResponse(packetType, spawnMonsterpayload, sequence);
    socket.write(spawnMonsterResponse);

    
    // 대칭상대 몬스터 스폰 동기화. 상대가 spawnMonsterHandler를 받았을때 보내면 됨.
    const spawnEnemyMonsterNotificationpayload = {
     monsterId: 100,
     monsterNumber: 100,
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
