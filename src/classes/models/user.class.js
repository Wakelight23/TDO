
class User {
  constructor(highScore = 0, score = 0, socket) {
    this.highScore = highScore;
    this.score = score;
    this.socket = socket;
    this.gold = 100;
    this.base = { hp: 100, maxHp: 100, }
    this.towers = [];
  }


  getMatchUserData() {



  }


}

export default User;