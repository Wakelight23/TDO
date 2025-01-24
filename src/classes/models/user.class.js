import { PacketType } from '../../constants/header.js';
import { getLastPathPoint } from '../../utils/monster/monsterPath.js';
import { createResponse } from '../../utils/response/createResponse.js';

class User {
  constructor(socket, highscore, id) {
    this.id = id;
    this.highscore = highscore;
    this.score = 0;
    this.socket = socket;
    this.gold = 100;
    this.base = { hp: 100, maxHp: 100 };
    this.basePosition = null;
    this.towers = [];
    this.monsters = []; //현재 내가 가진 몬스터.
    this.monsterPath = null;
    this.sequence = 0;
    this.matchingUsersocket = null;
    this.gameId = null;
    this.monsterLevel = 1;
    this.lastTowerPurchaseTime = 0; //마지막 타워 구매 시간 (타임스탬프)
  }

  updateHighScore(highScore) {
    this.highscore = highscore;
  }

  getHighScore() {
    return this.highscore;
  }

  updateScore(score) {
    this.score = score;
  }

  getScore() {
    return this.score;
  }

  //레벨 등에 따라서 처리해야 할 문제가 조금씩 있으니까 이런 게 필요할 듯 하다.
  pointMultiplier(point) {
    switch(this.monsterLevel)
    {
      case 0:
      case 1:
        return point;
        break;
      case 2:
        return point * 2;
        break;
      case 3:
      case 4:
        return point * 3;
        break;
      case 5:
      case 6:
      case 7:
        return point * 4;
        break;
      default:
        return point * 5;
        break;
    }
  }

  updateGold(gold) {
    this.gold = gold;
  }

  getGold() {
    return this.gold;
  }

  updateBase(hp) {
    this.base.hp = hp;
  }

  getBase() {
    return this.base;
  }

  getBasePositions() {
    return this.basePosition;
  }

  //몬스터 패스를 넣으며 패스의 끝부분이 베이스 포인트가 됩니다.
  updateMonsterPaths(monsterPath) {
    this.monsterPath = monsterPath;
    this.basePosition = getLastPathPoint(monsterPath);
  }

  getMonsterPaths() {
    return this.monsterPath;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  //매칭 상대의 소캣 저장용.
  updateMatchingUsersocket(matchingUsersocket) {
    this.matchingUsersocket = matchingUsersocket;
  }
  //매칭 상대의 소캣을 불러옵니다.
  getMatchingUsersocket() {
    return this.matchingUsersocket;
  }
  //참여한 게임의 아이디를 저장합니다.
  updateGameId(gameId) {
    this.gameId = gameId;
  }

  getGameId() {
    return this.gameId;
  }

  updateMonsterLevel(monsterLevel) {
    this.monsterLevel = monsterLevel;
  }

  getMonsterLevel() {
    return this.monsterLevel;
  }

  // // 쿨타임 체크
  // canPurchaseTower() {
  //   const currentTime = Date.now();
  //   const cooldownPeriod = 100; // 0.1초 (쿨타임 시간)
  //   const timeSinceLastPurchase = currentTime - this.lastTowerPurchaseTime;

  //   if (timeSinceLastPurchase < cooldownPeriod) {
  //     return false; // 쿨타임 중이라면 구매 불가
  //   }
  //   return true; // 쿨타임이 지나면 구매 가능
  // }

  // // 타워 구매 후 쿨타임 업데이트
  // updateTowerPurchaseTime() {
  //   this.lastTowerPurchaseTime = Date.now(); // 타워 구매 후 시간 갱신
  // }

  //타워 추가.
  addTower(tower) {
    this.towers.push(tower);
  }

  //몬스터 추가.
  addMonster(monster) {
    this.monsters.push(monster);
  }

  //몬스터 제거.
  removeMonster(monsterId) {
    const index = this.monsters.findIndex((monster) => monster.monsterId === monsterId);

    if (index !== -1) {
      return this.monsters.splice(index, 1)[0];
    }
  }

  //상태를 초기화 시킵니다.
  clearUserData() {
    this.score = 0;
    this.gold = 100;
    this.base = { hp: 100, maxHp: 100 };
    this.basePosition = null;
    this.towers = [];
    this.monsters = []; //현재 내가 가진 몬스터.
    this.monsterPath = null;
    this.sequence = 0;
    this.matchingUsersocket = null;
    this.gameId = null;
    this.monsterLevel = 1;
  }

  stateSyn() {
    const stateSyncPayload = {
      userGold: this.gold,
      baseHp: this.base.hp,
      monsterLevel: this.monsterLevel,
      score: this.score,
      towers: this.towers,
      monsters: this.monsters,
    };
    const packetType = PacketType.STATE_SYNC_NOTIFICATION;
    const stateSyncResponse = createResponse(packetType, stateSyncPayload, this.sequence);
    this.socket.write(stateSyncResponse);
  }
}

export default User;
