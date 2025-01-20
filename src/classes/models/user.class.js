class User {
  constructor(socket) {
    this.highScore = null;
    this.score = null;
    this.socket = socket;
    this.gold = 100;
    this.base = { hp: 100, maxHp: 100 };
    this.basePositions = null;
    this.towers = [];
    this.monsters = []; //현재 내가 가진 몬스터.
    this.monsterPaths = [];
    this.sequence = 0;
    this.matchingUsersocket = null;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  updateMatchingUsersocket(matchingUsersocket) {
    this.matchingUsersocket = matchingUsersocket;
  }

  getMatchingUsersocket() {
    return this.matchingUsersocket;
  } //필요 한가?

  getMatchUserData() {}

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

}

export default User;
