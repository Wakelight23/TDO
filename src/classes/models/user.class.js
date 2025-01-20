
class User {
  constructor(socket) {
    this.highScore = highScore;
    this.score = score;
    this.socket = socket;
    this.gold = 100;
    this.base = { hp: 100, maxHp: 100, }
    this.towers = [];
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
  }

  getMatchUserData() {

  }




}

export default User;