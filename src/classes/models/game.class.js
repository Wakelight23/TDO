import { PacketType } from "../../constants/header.js";
import { removeGameSession } from "../../session/game.session.js";
import { createResponse } from "../../utils/response/createResponse.js";

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting'; // 'waiting', 'inProgress'
    this.monsterLevel = 1; //몬스터 레벨입니다.
    this.spawnMonsterCounter = 10000; //몬스터 스폰 카운트 겸 몬스터 아이디 부여 변수입니다. 10000부터 시작하지만 타워가 9900개 이상 설치될것 같다면 더 올려도 됩니다. 마음대로 해도 됨.
    this.purchTowerConter = 100; // 타워 스폰 카운트 겸 타워 아이디 부여 변수 입니다.
    this.deleteAgreement = 0; //2가 되면 게임을 삭제합니다. 게임 엔드 페이로드가 오면 유저가 나가면서 하나를 올려줍니다. 모든 유저가 나가면 게임이 삭제됩니다. 생각해 보니까 삭제 시도 로직을 짜서 유저가 없을때만 삭제되게 하면 될지도.
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

  //가지고 있는 유저중 아이디가 같은 유저를 제외합니다.
  removeUseruserId(userId) {
    const index = this.users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1)[0]; // 제거된 사용자 반환
    }
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

      user1.updateMatchingUsersocket(user2.socket); // 유저1의 matchingUserSocket에 유저2의 소켓 할당
      user2.updateMatchingUsersocket(user1.socket); // 유저2의 matchingUserSocket에 유저1의 소켓 할당 --> 나중에 쓰기 편하라고.
    
      
    const initialGameState = { baseHp: 100, towerCost: 10, initialGold: 500, monsterSpawnInterval: 1 };
    const user1Data = { gold: user1.gold, base: user1.base, highScore: user1.highScore, towers: user1.towers, monsters: [], monsterLevel: this.monsterLevel, score:user1.score, monsterPath:user1.monsterPath, basePosition: user1.basePosition }
    const user2Data = { gold: user2.gold, base: user2.base, highScore: user2.highScore, towers: user2.towers, monsters: [], monsterLevel: this.monsterLevel, score:user2.score, monsterPath:user2.monsterPath, basePosition: user2.basePosition }
    
    //유저 1에게 보내는 페이로드 입니다. 플레이어 데이터를 유저 1 데이터로 보넵니다.
    let user1matchStartpayload = {
      initialGameState,
      playerData: user1Data,
      opponentData: user2Data,
    }
    const packetType = PacketType.MATCH_START_NOTIFICATION;
    let user1matchStartResponse = createResponse(packetType, user1matchStartpayload, user1.sequence);
    //유저1 소켓으로 보넵니다.
    user1.socket.write(user1matchStartResponse);

    //유저 2에게 보내는 페이로드 입니다. 플레이어 데이터를 유저 2 데이터로 보넵니다.
    let  user2matchStartpayload = {
      initialGameState,
      playerData: user2Data,
      opponentData: user1Data,
    }
    let user2matchStartResponse = createResponse(packetType, user2matchStartpayload, user2.sequence);
    //유저2 소켓으로 보넵니다.
    user2.socket.write(user2matchStartResponse);
  }


  //스폰하는 몬스터의 카운트를 줍니다. 카운트가 하나 올라갑니다.
  getSpawnMonsterCounter(){
    const spawnMonsterCounter = this.spawnMonsterCounter;
    this.spawnMonsterCounter++;
    return spawnMonsterCounter;
  }

  //설치하는 타워의 카운트를 줍니다. 카운트가 하나 올라갑니다.
  getPurchTowerConter(){
    const purchTowerConter = this.purchTowerConter;
    this.purchTowerConter++;
    return purchTowerConter;
  }

  //유저의 골드, 베이스체력, 몬스터레벨(게임에서 관리), 점수, 타워, 몬스터 등을 동기화 시킵니다.. 만 제가 확인한 유니티 코드에서는 골드, 베이스체력, 몬스터레벨(게임에서 관리), 점수만 동기화 시킵니다.
  //유저의 골드, 베이스체력, 몬스터레벨, 점수등을 변경후 이 함수를 실행하면 클라이언트에 적용이 될겁니다. 안해봐서 모름.
  stateSyn(){ 
    this.users.forEach((user) => {
      const stateSyncpayload = { userGold: user.gold, baseHP: user.base.hp, monsterLevel: this.monsterLevel, score: user.score, towers: user.towers, moseters: user.monsters}
      console.log("stateSyncpayload:",stateSyncpayload);
      const packetType = PacketType.STATE_SYNC_NOTIFICATION;
      const stateSyncResponse = createResponse(packetType, stateSyncpayload, user.sequence);
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


}

export default Game;
