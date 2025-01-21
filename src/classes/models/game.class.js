class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
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
    const users = this.users.map((user) => {
      //const { x, y } = user.calculatePosition();
      //return { id: user.id, role: user.role, x, y };
    });
    //const startPacket = gameStartNotification(users ,this.id, Date.now());
     this.users.forEach((user) => {
      //user.socket.write(startPacket);
    });
  }
}

export default Game;
