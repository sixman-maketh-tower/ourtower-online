import { config } from '../../config/config.js';
import {
  gameOverNotification,
  updateBaseHpNotification,
} from '../../utils/notification/game.notification.js';

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

  // 기존 강의는 내가 상대방의 위치정보도 받는거고
  // 이번 과제에서는 Hp가 깎인걸 나도 받고 상대방도 받아야함
  getAllBaseHp(attackedUserId, attackedUserBaseHp) {
    // forEach나 for문으로 체력이 까진 당사자의 baseHp 소켓을 socket.write로 보내줘야할듯
    // 게임안에는 2명의 유저가 존재
    this.users.forEach((user) => {
      const socket = user.socket;
      if (user.id === attackedUserId) {
        const AttackedUserPacket = updateBaseHpNotification(false, attackedUserBaseHp);
        socket.write(AttackedUserPacket);
      } else {
        const AnotherUserPacket = updateBaseHpNotification(true, attackedUserBaseHp);
        socket.write(AnotherUserPacket);
      }
    });
  }

  gameOver() {
    this.users.forEach((user) => {
      const socket = user.socket;
      if (user.baseHp > 0) {
        const winUserPacket = gameOverNotification(true);
        socket.write(winUserPacket);
      } else {
        const loseUserPacket = gameOverNotification(false);
        socket.write(loseUserPacket);
      }
    });
  }
}

export default Game;
