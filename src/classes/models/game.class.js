import { config } from '../../config/config.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
  }

  // Game에 User가 참가
  addUser(user) {
    if (this.users.length >= config.game.maxPlayer) {
      throw new Error('게임 인원이 가득 차 참가하실 수 없습니다.');
    }

    this.users.push(user);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);
  }

  startGame() {
    this.state = config.game.state.playing;
  }

  getAllBaseHp() {
    const baseHpData = this.users
      .filter((user) => user.id !== userId) // 본인말고 다른 유저의 정보를 가져옴
      .map((user) => {
        // 가져온 정보로 객체를 생성
        const {baseHp} = user.getBaseHp();
        return { packetType: 17, isOpponent: true, baseHp };
      });

    return createUpdateBaseHpPacket(baseHpData);
  }
}

export default Game;
