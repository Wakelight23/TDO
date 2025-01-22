import { PacketType } from '../../constants/header.js';
import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const towerPurchaseHandler = async ({ socket, sequence, payload }) => {
  try {
    //console.log('타워 구매 시작');
    const { x, y } = payload;

    // 1. x, y 값 검증
    if (typeof x !== 'number' || typeof y !== 'number' || x < 0 || y < 0) {
      console.error('유효하지 않은 위치입니다.');
      return; // 에러 발생시 바로 리턴
    }

    const user = getUserBySocket(socket);
    const gameSessions = getJoinGameSessions(user);
    let userGold = user.getGold();

    // 2. 타워 코스트 확인
    const towerCost = gameSessions.towerCost; // 기본값 10
    if (userGold < towerCost) {
      console.error('골드가 부족합니다.');
      return; // 에러 발생시 바로 리턴
    }

    // 3. 골드 차감
    user.updateGold(userGold - towerCost);

    // 4. 타워 정보 생성 및 추가
    const towerId = gameSessions.getPurchTowerConter();
    const tower = { x: x, y: y, towerId: towerId };

    user.addTower(tower);

    //console.log('유저가 보유한 타워:', user.towers);

    // 5. 로그 기록
    //console.log(`사용자가 타워 ID: ${towerId}, 위치: (${x}, ${y}), 남은 골드: ${user.getGold()}`);

    // 6. 타워 구매 응답
    const towerPurchasePayload = { towerId: towerId };
    const towerPurchaseResponse = createResponse(
      PacketType.TOWER_PURCHASE_RESPONSE,
      towerPurchasePayload,
      sequence,
    );
    socket.write(towerPurchaseResponse);

    // 7. 상대방에게 타워 추가 알림 전송
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());
    if (enemyUser && enemyUser.socket) {
      const addEnemyTowerNotificationPayload = { x: x, y: y, towerId: towerId };
      const addEnemyTowerNotificationResponse = createResponse(
        PacketType.ADD_ENEMY_TOWER_NOTIFICATION,
        addEnemyTowerNotificationPayload,
        sequence,
      );
      enemyUser.socket.write(addEnemyTowerNotificationResponse);
    } else {
      console.warn('상대방이 연결되어 있지 않음');
    }

    console.log('타워 구매 완료');
  } catch (error) {
    console.error('타워 구매 처리 중 오류 발생:', error);
  }
};

export default towerPurchaseHandler;
