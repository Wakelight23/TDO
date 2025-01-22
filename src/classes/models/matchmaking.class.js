class MatchmakingQueue {
  constructor() {
    this.waitingUsers = [];
    this.scoreRange = 50; // 초기 매칭 범위
    this.maxWaitTime = 30000; // 최대 대기 시간 (30초)
  }

  // 대기열에 유저 추가
  addToQueue(user) {
    this.waitingUsers.push({
      user,
      joinTime: Date.now(),
      highScore: user.getHighScore(),
    });
  }

  // 매칭 가능한 유저들 찾기
  findMatchableUsers(user) {
    const userScore = user.getHighScore();
    const currentTime = Date.now();

    return this.waitingUsers.filter((waitingUser) => {
      // 자기 자신 제외
      if (waitingUser.user === user) return false;

      const scoreDiff = Math.abs(waitingUser.highScore - userScore);
      const waitTime = currentTime - waitingUser.joinTime;

      // 대기 시간이 길어질수록 매칭 범위 확대
      const adjustedScoreRange = this.scoreRange + (waitTime / 1000) * 2;

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

      return matchedUser;
    }
  }

  // 대기열에서 유저 제거
  removeFromQueue(user) {
    this.waitingUsers = this.waitingUsers.filter((waitingUser) => waitingUser.user !== user);
  }
}

export default MatchmakingQueue;
