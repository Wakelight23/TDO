import { PacketType } from '../../constants/header.js';
import { removeGameSession } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting'; // 'waiting', 'inProgress'
    this.monsterLevel = 1; //몬스터 레벨입니다.
    this.spawnMonsterCounter = 10000; //몬스터 스폰 카운트 겸 몬스터 아이디 부여 변수입니다. 10000부터 시작하지만 타워가 9900개 이상 설치될것 같다면 더 올려도 됩니다. 마음대로 해도 됨.
    this.purchTowerConter = 100; // 타워 스폰 카운트 겸 타워 아이디 부여 변수 입니다.
    this.goldPurchTowerConter = 1000; // 타워 스폰 카운터 골드 더줌
    this.scorePurchTowerConter = 2000; // 타워 스폰 카운터 점수 더줌
    this.bothPurchTowerConter = 3000; // 타워 스폰 카운터 둘 다 더줌
    this.deleteAgreement = 0; //2가 되면 게임을 삭제합니다. 게임 엔드 페이로드가 오면 유저가 나가면서 하나를 올려줍니다. 모든 유저가 나가면 게임이 삭제됩니다. 생각해 보니까 삭제 시도 로직을 짜서 유저가 없을때만 삭제되게 하면 될지도.
    this.startTime = Date.now();
    this.playingTime = 0;
    this.baseHp = 100;
    this.towerCost = 100;
    this.initialGold = 500;
    this.monsterSpawnInterval = 1;
  }

  //유저를 넣어둡니다. 유저에게 게임 아이디를 추가합니다.
  addUser(user) {
    user.updateGameId(this.id);
    this.users.push(user);
  }

  //가지고 있는 유저중 아이디가 같은걸 찾습니다.
  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  getUserBySocket(socket) {
    return this.users.find((user) => user.socket === socket);
  }

  getOtherUserBySocket(socket) {
    return this.users.find((user) => user.socket !== socket);
  }

  //가지고 있는 유저중 아이디가 같은 유저를 제외합니다.
  removeUseruserId(userId) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1)[0]; // 제거된 사용자 반환
    }
  }

  getOtherUser(userId) {
    return this.users.find((user) => user.id !== userId);
  }

  //가지고 있는 유저중 소켓이 같은 유저를 제외합니다.
  removeUsersocket(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      this.users.splice(index, 1)[0]; // 제거된 사용자 반환
    }
  }

  //게임 시작 함수입니다. 게임 상태를 'inProgress'로 바꾸어 줍니다.
  startGame() {
    this.state = 'inProgress';
    const [user1, user2] = this.users;

    console.log('\n🚀 ~ Game start');
    console.log('\n🚀 ~ Game ~ startGame ~ user1, user2:', user1, user2);

    user1.updateMatchingUsersocket(user2.socket); // 유저1의 matchingUserSocket에 유저2의 소켓 할당
    user2.updateMatchingUsersocket(user1.socket); // 유저2의 matchingUserSocket에 유저1의 소켓 할당 --> 나중에 쓰기 편하라고.

    const initialGameState = {
      baseHp: this.baseHp,
      towerCost: this.towerCost,
      initialGold: this.initialGold,
      monsterSpawnInterval: this.monsterSpawnInterval,
    };

    this.users.forEach((user) => {
      user.updateBase(this.baseHp);
      user.updateGold(this.initialGold);
    });

    const user1Data = {
      gold: user1.gold,
      base: user1.base,
      highScore: user1.highScore,
      towers: user1.towers,
      monsters: [],
      monsterLevel: user1.monsterLevel,
      score: user1.score,
      monsterPath: user1.monsterPath,
      basePosition: user1.basePosition,
    };
    const user2Data = {
      gold: user2.gold,
      base: user2.base,
      highScore: user2.highScore,
      towers: user2.towers,
      monsters: [],
      monsterLevel: user2.monsterLevel,
      score: user2.score,
      monsterPath: user2.monsterPath,
      basePosition: user2.basePosition,
    };

    //유저 1에게 보내는 페이로드 입니다. 플레이어 데이터를 유저 1 데이터로 보넵니다.
    let user1matchStartpayload = {
      initialGameState,
      playerData: user1Data,
      opponentData: user2Data,
    };
    const packetType = PacketType.MATCH_START_NOTIFICATION;
    let user1matchStartResponse = createResponse(
      packetType,
      user1matchStartpayload,
      user1.sequence,
    );
    //유저1 소켓으로 보넵니다.
    user1.socket.write(user1matchStartResponse);

    //유저 2에게 보내는 페이로드 입니다. 플레이어 데이터를 유저 2 데이터로 보넵니다.
    let user2matchStartpayload = {
      initialGameState,
      playerData: user2Data,
      opponentData: user1Data,
    };
    let user2matchStartResponse = createResponse(
      packetType,
      user2matchStartpayload,
      user2.sequence,
    );
    //유저2 소켓으로 보넵니다.
    user2.socket.write(user2matchStartResponse);
  }

  //스폰하는 몬스터의 카운트를 줍니다. 카운트가 하나 올라갑니다.
  getSpawnMonsterCounter() {
    const spawnMonsterCounter = this.spawnMonsterCounter;
    this.spawnMonsterCounter++;
    return spawnMonsterCounter;
  }

  //설치하는 타워의 카운트를 줍니다. 카운트가 하나 올라갑니다.
  getPurchTowerConter() {
    const purchTowerConter = this.purchTowerConter;
    this.purchTowerConter++;
    return purchTowerConter;
  }

  //설치하는 골드 타워의 카운트를 줍니다. 카운트가 하나 올라갑니다.
  getGoldPurchTowerConter() {
    const goldPurchTowerConter = this.goldPurchTowerConter;
    this.goldPurchTowerConter++;
    return goldPurchTowerConter;
  }

  //설치하는 스코어의 카운트를 줍니다. 카운트가 하나 올라갑니다.
  getScorePurchTowerConter() {
    const scorePurchTowerConter = this.scorePurchTowerConter;
    this.scorePurchTowerConter++;
    return scorePurchTowerConter;
  }

  //설치하는 스코어, 골드 타워 의 카운트를 줍니다. 카운트가 하나 올라갑니다.
  getBothPurchTowerConter() {
    const bothPurchTowerConter = this.bothPurchTowerConter;
    this.bothPurchTowerConter++;
    return bothPurchTowerConter;
  }

  stateSyn() {
    this.users.forEach((user) => {
      const stateSyncPayload = {
        userGold: user.gold,
        baseHp: user.base.hp,
        monsterLevel: user.monsterLevel,
        score: user.score,
        towers: user.towers,
        monsters: user.monsters,
      };
      const packetType = PacketType.STATE_SYNC_NOTIFICATION;
      const stateSyncResponse = createResponse(packetType, stateSyncPayload, user.sequence);
      user.socket.write(stateSyncResponse);
    });
  }

  //삭제 변수가 1 늘어납니다.
  addDeleteAgreement() {
    this.deleteAgreement += 1;
    if (this.deleteAgreement >= 2) {
      this.deleteSession();
    }
  }

  //삭제변수가 2가 되면 게임을 삭제합니다.
  deleteSession() {
    removeGameSession(this.id);
  }

  //여기서 계속 
  updateTimestamp(deltaTime) {
    this.playingTime += deltaTime;
    let currentLowLevel = Infinity;
    //console.log(this.playingTime);
    this.users.forEach((user) => {
      //일단 레벨 올라가는공식을 이렇게 해보도록 하고 
      //공식 : (스코어 + (시간 값/1000)) / ((시간 값/(1000 + user.monsterLevel * 100)) + 500);
      //시간 경과에 따라서 조금씩 필요한 스코어가 많이 필요해지는 방식
      //레벨이 일정 이상 올라가지 않게 할거면 currentLowLevel 연산 단계에서 limit 값을 넣으면 된다.
      user.monsterLevel = Math.max(user.monsterLevel, Math.ceil((user.score + this.playingTime / 1000) / (this.playingTime / (1000 + (user.monsterLevel- 1) * 100) + (500))));
      currentLowLevel = Math.min(currentLowLevel, user.monsterLevel, 8);
    });

    this.monsterLevel = currentLowLevel;

    //약 0.1초 뒤부터 업데이트를 진행하겠다.
    if (this.playingTime > 1000) {
      this.stateSyn();
    }
  }
  //몬스터가 몇 마리 소환되었는가에 따라서 레벨이 오르는 구조
  levelUp() {

    this.monsterLevel = this.monsterLevel <= 5 ? this.monsterLevel + 1 : this.monsterLevel;
  }
}

export default Game;
