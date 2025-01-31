import { v4 as uuidv4 } from 'uuid';
import { addGameSession } from '../../session/game.session.js';
import { generateRandomMonsterPath } from '../../utils/monster/monsterPath.js';

class MatchmakingQueue {
  constructor() {
    this.waitingUsers = [];
    this.scoreRange = 200; // 초기 매칭 범위
    this.matchingInterval = null;
    this.matchingUsers = new Set(); // 게임 중인 유저 저장
  }

  // 대기열에 유저 추가
  addToQueue(user) {
    // 이미 대기열에 있는 유저인지 확인
    const isUserInQueue = this.waitingUsers.some((waitingUser) => waitingUser.user.id === user.id);

    if (isUserInQueue) {
      console.log(`${user.id} 님은 이미 대기열에 있습니다.`);
      return false;
    }

    this.waitingUsers.push({
      user,
      joinTime: Date.now(),
    });

    return true; // 대기열에 추가되었을 경우 true 반환
  }

  // 매칭 가능한 유저들 찾기
  findMatchableUsers(user) {
    const userScore = user.highscore;
    const currentTime = Date.now();

    console.log(`
      [매칭 시도 정보]
      - 현재 유저: ${user.id} (점수: ${userScore})
      - 대기열 유저 수: ${this.waitingUsers.length}
      - 현재 시간: ${currentTime}
    `);

    return this.waitingUsers.filter((waitingUser) => {
      // 자기 자신 제외
      if (waitingUser.user === user) {
        //console.log(`- 자기 자신 제외: ${waitingUser.user.id}`);
        return false;
      }

      const scoreDiff = Math.abs(waitingUser.user.highscore - userScore);
      const waitTime = currentTime - waitingUser.joinTime;

      // 대기 시간이 길어질수록 매칭 범위 확대
      const adjustedScoreRange = this.scoreRange + (waitTime / 1000) * 20;

      // console.log(`
      //   [매칭 상세 정보]
      //   - 대기 유저: ${waitingUser.user.id} (점수: ${waitingUser.user.highscore})
      //   - 점수 차이: ${scoreDiff}
      //   - 대기 시간: ${waitTime / 1000}초
      //   - 현재 매칭 범위: ${adjustedScoreRange}
      //   - 매칭 가능 여부: ${scoreDiff <= adjustedScoreRange}
      // `);

      return scoreDiff <= adjustedScoreRange;
    });
  }

  // 매칭 실행
  executeMatch(user) {
    const matchableUsers = this.findMatchableUsers(user);

    if (matchableUsers.length > 0) {
      // 매칭 가능한 유저들 중 랜덤 선택
      const randomIndex = Math.floor(Math.random() * matchableUsers.length);
      const matchedUser = matchableUsers[randomIndex].user;

      // 대기열에서 2명의 유저 제거
      this.removeFromQueue(user);
      this.removeFromQueue(matchedUser);

      console.log('\n🚀 ~ MatchmakingQueue ~ executeMatch ~ matchedUser:', matchedUser.id);

      return matchedUser;
    }
  }

  // 대기열에서 유저 제거
  removeFromQueue(user) {
    this.waitingUsers = this.waitingUsers.filter((waitingUser) => waitingUser.user !== user);
    console.log(
      '\n🚀 ~ MatchmakingQueue ~ removeFromQueue ~ this.waitingUsers:',
      this.waitingUsers,
    );
  }

  // 매칭 시도 시작
  startMatching(user) {
    // 이미 게임 중인 유저라면 중복 매칭 방지
    if (this.matchingUsers.has(user.id)) {
      return;
    }

    this.matchingUsers.add(user.id);

    this.matchingInterval = setInterval(async () => {
      // 유저가 이미 게임 중이거나 매칭이 완료된 경우
      if (!this.waitingUsers.some((waitingUser) => waitingUser.user.id === user.id)) {
        this.stopMatching(user.id);
        return;
      }

      const matchedUser = this.executeMatch(user);

      if (matchedUser) {
        this.stopMatching(user.id);
        this.stopMatching(matchedUser.id);

        // 게임 세션 생성 및 시작
        const gameId = uuidv4();
        const gameSession = addGameSession(gameId);
        console.log("게임 세션이 만들어 졌다!!!", "user.id",user.id,"matchedUser.id",matchedUser.id);

        // 몬스터 경로 생성 및 설정
        const path1 = generateRandomMonsterPath(340);
        const path2 = generateRandomMonsterPath(340);

        user.updateMonsterPaths(path1);
        matchedUser.updateMonsterPaths(path2);

        // 유저들을 게임 세션에 추가
        gameSession.addUser(user);
        gameSession.addUser(matchedUser);

        // 초기 타워 설정
        const tower1 = { towerId: gameSession.getPurchTowerConter(), x: 200, y: 340 };
        const tower2 = { towerId: gameSession.getPurchTowerConter(), x: 200, y: 340 };

        user.addTower(tower1);
        matchedUser.addTower(tower2);

        // 게임 시작
        gameSession.startGame();
      }
    }, 1000);
  }

  // 매칭 시도 중단
  stopMatching(userId) {
    if (this.matchingInterval) {
      clearInterval(this.matchingInterval);
      this.matchingInterval = null;
    }
    this.waitingUsers = this.waitingUsers.filter((waitingUser) => waitingUser.user.id !== userId);
    this.matchingUsers.delete(userId);
  }
}

const matchmakingQueue = new MatchmakingQueue();
export default matchmakingQueue;
