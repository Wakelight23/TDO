import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { notificationGameSessionsBySocket } from '../../session/game.session.js';

const spawnMonsterNotification = async ({ socket, sequence, payload }) => {
  try {
    const { monsterId, monsterNumber } = payload; //소켓으로 유저 찾아서 매칭.

    //게임 내 세션에서 monsterNumber를 읽고 최대 숫자만큼을 받아오도록 한다.
    const spawnMonsterpayload = {
      monsterId: monsterId,
      monsterNumber: monsterNumber,
    };

    //현재 플레이어가 속해 있는 게임 세션을 가져오기
    const otherSocketList = gamesession.getOtherUserBySocket(socket).map((user) => user.socket);

    const otherPlayerpacketType = PacketType.SPAWN_ENEMY_MONSTER_NOTIFICATION;
    const spawnEnemyMonsterNotificationResponse = createResponse(
      otherPlayerpacketType,
      spawnMonsterpayload,
      sequence,
    );
    for (let otherSocket of otherSocketList) {
      otherSocket.write(spawnEnemyMonsterNotificationResponse);
    }

    notificationGameSessionsBySocket(socket);
  } catch (error) {
    console.error(error);
  }
};

export default spawnMonsterNotification;
