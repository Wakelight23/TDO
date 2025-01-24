import { PacketType } from '../../constants/header.js';
import { getJoinGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const towerPurchaseHandler = async ({ socket, sequence, payload }) => {
  try {
    // 1. x, y 값 검증
    const { x, y } = payload;
    if (typeof x !== 'number' || typeof y !== 'number' || x < 0 || y < 0) {
      console.error('유효하지 않은 위치입니다.');
      return; // 에러 발생시 바로 리턴
    }

    // 2. 유저 객체 가져오기
    const user = getUserBySocket(socket);

    // // 3. 쿨타임 체크
    // if (!user.canPurchaseTower()) {
    //   const remainingCooldown = 5000 - (Date.now() - user.lastTowerPurchaseTime);
    //   console.log(`쿨타임이 남았습니다. ${remainingCooldown}ms 후에 다시 시도해주세요.`);
    //   return; // 쿨타임이 남아있으면 타워 구매 불가
    // }

    // 4. 게임 세션 및 골드 확인
    const gameSessions = getJoinGameSessions(user);
    let userGold = user.getGold();

    const towerCost = gameSessions.towerCost; // 기본값 10
    if (userGold < towerCost) {
      console.error('골드가 부족합니다.');
      return; // 에러 발생시 바로 리턴
    }

    // 5. 골드 차감
    user.updateGold(userGold - towerCost);

    // 6. 타워 구매 후 쿨타임 갱신
    user.updateTowerPurchaseTime(); // 타워 구매 후 쿨타임 갱신

    // 7. 스페셜 타워 확률 처리
    const normalTowerChance = 70; // 일반 타워: 70%
    const goldTowerChance = 13; // 골드 타워: 13%
    const scoreTowerChance = 13; // 스코어 타워: 13%
    const bothTowerChance = 4; // 둘 다 타워: 4%

    const specialTowerTotalChance =
      normalTowerChance + goldTowerChance + scoreTowerChance + bothTowerChance;

    let towerId;
    let towerType = 'normal'; // 기본 타워는 일반 타워

    const randomValue = Math.ceil(Math.random() * 100); // 1 ~ 100 사이의 정수

    console.log(`랜덤 값: ${randomValue}`);

    if (randomValue < normalTowerChance) {
      towerType = 'normal';
      towerId = gameSessions.getPurchTowerConter();
    } else if (randomValue < normalTowerChance + goldTowerChance) {
      towerType = 'gold';
      towerId = gameSessions.getGoldPurchTowerConter();
    } else if (randomValue < normalTowerChance + goldTowerChance + scoreTowerChance) {
      towerType = 'score';
      towerId = gameSessions.getScorePurchTowerConter();
    } else if (randomValue <= specialTowerTotalChance) {
      towerType = 'both';
      towerId = gameSessions.getBothPurchTowerConter();
    }

    console.log(`선택된 타워 타입: ${towerType}`);

    // 8. 타워 정보 생성 및 추가
    const tower = { towerId: towerId, x: x, y: y };
    user.addTower(tower);

    console.log('유저가 보유한 타워:', user.towers);

    // 9. 타워 구매 응답
    const towerPurchasePayload = { towerId: towerId };
    const towerPurchaseResponse = createResponse(
      PacketType.TOWER_PURCHASE_RESPONSE,
      towerPurchasePayload,
      sequence,
    );
    socket.write(towerPurchaseResponse);

    // 10. 상대방에게 타워 추가 알림 전송
    const enemyUser = getUserBySocket(user.getMatchingUsersocket());
    if (enemyUser && enemyUser.socket) {
      const addEnemyTowerNotificationPayload = { towerId: towerId, x: x, y: y };
      const addEnemyTowerNotificationResponse = createResponse(
        PacketType.ADD_ENEMY_TOWER_NOTIFICATION,
        addEnemyTowerNotificationPayload,
        sequence,
      );
      enemyUser.socket.write(addEnemyTowerNotificationResponse);
      
    } else {
      console.warn('상대방이 연결되어 있지 않음');
    }
  } catch (error) {
    console.error('타워 구매 처리 중 오류 발생:', error);
  }
};

export default towerPurchaseHandler;
