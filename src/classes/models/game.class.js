import { PacketType } from "../../constants/header.js";
import { removeGameSession } from "../../session/game.session.js";
import { createResponse } from "../../utils/response/createResponse.js";

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting'; // 'waiting', 'inProgress'
    this.monsterLevel = 1;
    this.spawnMonsterCounter = 10000;
    this.purchTowerConter = 100;
    this.deleteAgreement = 0; //삭제를 위한 변수
  }

  addUser(user) {
    user.updateGameId(this.id);
    this.users.push(user);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUseruserId(userId) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1)[0]; // 제거된 사용자 반환
    }
  }

  removeUsersocket(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      this.users.splice(index, 1)[0]; // 제거된 사용자 반환
    }
  }
 
  startGame() {
    this.state = 'inProgress';
      const [user1, user2] = this.users;

      user1.updateMatchingUsersocket(user2.socket); // 유저1의 matchingUserSocket에 유저2의 소켓 할당
      user2.updateMatchingUsersocket(user1.socket); // 유저2의 matchingUserSocket에 유저1의 소켓 할당 --> 나중에 쓰기 편하라고.
    
    const initialGameState = { baseHp: 100, towerCost: 10, initialGold: 500, monsterSpawnInterval: 1 };
    const user1Data = { gold: user1.gold, base: user1.base, highScore: user1.highScore, towers: user1.towers, monsters: [], monsterLevel: this.monsterLevel, score:user1.score, monsterPath:user1.monsterPath, basePosition: user1.basePosition }
    const user2Data = { gold: user2.gold, base: user2.base, highScore: user2.highScore, towers: user2.towers, monsters: [], monsterLevel: this.monsterLevel, score:user2.score, monsterPath:user2.monsterPath, basePosition: user2.basePosition }
    
    let user1matchStartpayload = {
      initialGameState,
      playerData: user1Data,
      opponentData: user2Data,
    }
    const packetType = PacketType.MATCH_START_NOTIFICATION;
    let user1matchStartResponse = createResponse(packetType, user1matchStartpayload, user1.sequence);
    user1.socket.write(user1matchStartResponse);

    let  user2matchStartpayload = {
      initialGameState,
      playerData: user2Data,
      opponentData: user1Data,
    }
    let user2matchStartResponse = createResponse(packetType, user2matchStartpayload, user2.sequence);
    user2.socket.write(user2matchStartResponse);
  }

  getSpawnMonsterCounter(){
    const spawnMonsterCounter = this.spawnMonsterCounter;
    this.spawnMonsterCounter++;
    return spawnMonsterCounter;
  }

  getPurchTowerConter(){
    const purchTowerConter = this.purchTowerConter;
    this.purchTowerConter++;
    return purchTowerConter;
  }

  stateSyn(){
    this.users.forEach((user) => {
      const stateSyncpayload = { userGold: user.gold, baseHP: user.base.hp, monsterLevel: this.monsterLevel, score: user.score, towers: user.towers, moseters: user.monsters}
      console.log("stateSyncpayload:",stateSyncpayload);
      const packetType = PacketType.STATE_SYNC_NOTIFICATION;
      const stateSyncResponse = createResponse(packetType, stateSyncpayload, user.sequence);
      user.socket.write(stateSyncResponse);
    });
   }

   addDeleteAgreement() {
    this.deleteAgreement += 1;
    if (this.deleteAgreement >= 2) {
      this.deleteSession();
    }
  }

  deleteSession() {
    removeGameSession(this.id);
  }


}

export default Game;
