import { config } from '../../config/config.js';
import { MAX_PLAYER } from '../../constants/game.js';
import { gameStartNotification } from '../../utils/notification/game.notification.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting';
  }

  // Game에 User가 참가
  addUser(user) {
    if (this.users.length >= config.game.maxPlayer) {
      throw new Error('게임 인원이 가득 차 참가하실 수 없습니다.');
    }
    this.users.push(user);

    if (this.users.length === MAX_PLAYER) {
      setTimeout(() => {
        this.startGame();
      }, 2000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    // this.intervalManager.removePlayer(userId);
  }

  getOpponetData(userId) {
    const opponetData = this.users
      .filter((user) => user.id !== userId)
      .map((user) => {
        return { id: user.id };
      });
    return opponetData;
  }

  startGame() {
    this.state = config.game.state.playing; // 확인필요
    const startPacket = gameStartNotification(this.id, Date.now());

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }
}

export default Game;
