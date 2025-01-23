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

    // 4. 스페셜 타워 확률 처리 (예: 10% 확률로 스페셜 타워 구매)
    const specialTowerChance = 10; // 10% 확률을 1에서 100까지 범위로 설정
    let isSpecialTower = false;

    // Math.random() 값을 따로 변수로 저장
    const randomValue = Math.random() * 100;

    console.log(`랜덤 값: ${randomValue}`); // 랜덤 값 출력

    // 그 랜덤 값이 specialTowerChance 이하일 때 스페셜 타워로 설정
    if (randomValue < specialTowerChance) {
      isSpecialTower = true;
    }

    console.log(`스페셜 타워 여부: ${isSpecialTower}`); // 스페셜 타워 여부 출력

    // 5. 스페셜 타워 카운터 (스페셜 타워일 경우)
    let towerId = gameSessions.getPurchTowerConter(); // 기본 타워 ID
    if (isSpecialTower) {
      towerId = gameSessions.getSpecialPurchTowerConter(); // 스페셜 타워 ID
    }

    // 6. 타워 정보 생성 및 추가
    const tower = { towerId: towerId, x: x, y: y };
    user.addTower(tower);

    console.log('유저가 보유한 타워:', user.towers);

    // 7. 로그 기록
    //console.log(`사용자가 타워 ID: ${towerId}, 위치: (${x}, ${y}), 남은 골드: ${user.getGold()}`);

    // 8. 타워 구매 응답 (패킷 데이터는 그대로 유지)
    const towerPurchasePayload = { towerId: towerId }; // 패킷에는 스페셜 타워 여부를 포함하지 않음
    const towerPurchaseResponse = createResponse(
      PacketType.TOWER_PURCHASE_RESPONSE,
      towerPurchasePayload,
      sequence,
    );
    socket.write(towerPurchaseResponse);

    // 9. 상대방에게 타워 추가 알림 전송
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

    //console.log('타워 구매 완료');
  } catch (error) {
    console.error('타워 구매 처리 중 오류 발생:', error);
  }
};

export default towerPurchaseHandler;
