import { BOTH_TOWER, GOLD_TOWER, NOMAL_TOWER, SCORE_TOWER } from '../../constants/env.js';
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

    // 3. 게임 세션 및 골드 확인
    const gameSessions = getJoinGameSessions(user);
    let userGold = user.getGold();

    const towerCost = gameSessions.towerCost; // 기본값 10
    if (userGold < towerCost) {
      console.error('골드가 부족합니다.');
      return; // 에러 발생시 바로 리턴
    }

    // 4. 골드 차감
    user.updateGold(userGold - towerCost);

    // 5. 스페셜 타워 확률 처리
    const normalTowerChance = Number(NOMAL_TOWER); // 일반 타워: 70%
    const goldTowerChance = Number(GOLD_TOWER); // 골드 타워: 13%
    const scoreTowerChance = Number(SCORE_TOWER); // 스코어 타워: 13%
    const bothTowerChance = Number(BOTH_TOWER); // 둘 다 타워: 4%

    console.log(normalTowerChance + goldTowerChance);
    console.log(scoreTowerChance + bothTowerChance);

    console.log(normalTowerChance, goldTowerChance, scoreTowerChance, bothTowerChance);

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

    // 6. 타워 정보 생성 및 추가
    const tower = { towerId: towerId, x: x, y: y };
    user.addTower(tower);

    console.log('유저가 보유한 타워:', user.towers);

    // 7. 타워 구매 응답
    const towerPurchasePayload = { towerId: towerId };
    const towerPurchaseResponse = createResponse(
      PacketType.TOWER_PURCHASE_RESPONSE,
      towerPurchasePayload,
      sequence,
    );
    socket.write(towerPurchaseResponse);

    // 8. 상대방에게 타워 추가 알림 전송
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
