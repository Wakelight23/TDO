import { getLastPathPoint } from "../../utils/monster/monsterPath.js";

class User {
  constructor(socket) {
    this.highScore = 100;
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
  }

  updateHighScore(highScore) {
    this.highScore = highScore;
  }

  gethigHScore() {
    return this.highScore;
  }

  updateScore(score) {
    this.score = score;
  }

  getScore() {
    return this.score;
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

  updateSpawnMonstercounter(spawnMonstercounter) {
    this.spawnMonstercounter = spawnMonstercounter;
  }

  getSpawnMonstercounter() {
    const spawnMonstercounter = this.spawnMonstercounter;
    this.spawnMonstercounter++;
    return spawnMonstercounter;
  }

  updateMatchingUsersocket(matchingUsersocket) {
    this.matchingUsersocket = matchingUsersocket;
  }

  getMatchingUsersocket() {
    return this.matchingUsersocket;
  } 

  updateGameId(gameId) {
    this.gameId = gameId;
  }

  getGameId() {
    return this.gameId;
  } 

  //타워 추가.
  addTower(tower){
    this.towers.push(tower);
  }

  //몬스터 추가.
  addMonster(monster){
    this.monsters.push(monster);
  }

  //몬스터 제거.
  removeMonster(monsterId) {
    const index = this.monsters.findIndex((monster) => monster.monsterId === monsterId);

    if (index !== -1) {
      return this.monsters.splice(index, 1)[0];
    }
  }

  clearUserData(){
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
  }
}

export default User;
