import { config } from '../../config/config.js';
import {
  CANVAS_HEIGH,
  CANVAS_WIDTH,
  INIT_BASE_DATA,
  INIT_BASE_HP,
  INIT_GOLD,
  INIT_MONSTER_SPAWN_INTERVAL,
  INIT_TOWER_COST,
} from '../../constants/game.js';
import {
  findHighScoreByUserId,
} from '../../db/user/user.db.js';
import {
  gameStartNotification,
  gameOverNotification,
  updateBaseHpNotification,
} from '../../utils/notification/game.notification.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = config.game.state.waiting;
    this.path = [];
  }

  // Game에 User가 참가
  addUser(user) {
    this.users.push(user);

    if (this.users.length >= config.game.maxPlayer) {
      // throw new Error('게임 인원이 가득 차 참가하실 수 없습니다.');
    }

    if (this.users.length === config.game.maxPlayer) {
      setTimeout(() => {
        this.startGame(user.id);
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

  getOpponentUserId(userId) {
    const opponentUser = this.users.find((user) => user.id !== userId);
    return opponentUser.id;
  }

  async getUserHighScore(userId) {
    const user = this.getUser(userId);
    const dbUserHighScore = await findHighScoreByUserId(user.id);
    return dbUserHighScore;
  }

  async startGame(userId) {
    if (this.users.length !== config.game.maxPlayer) {
      return false;
    }

    this.state = config.game.state.playing;
    this.path = this.initMonsterPath(CANVAS_WIDTH, CANVAS_HEIGH);

    this.getUser(userId).state = config.game.state.playing;

    const playerHighScore = await this.getUserHighScore(userId);

    const opponentUserId = this.getOpponentUserId(userId);
    this.getUser(opponentUserId).state = config.game.state.playing;
    const opponentHighScore = await this.getUserHighScore(opponentUserId);

    const initialGameState = {
      baseHp: INIT_BASE_HP,
      towerCost: INIT_TOWER_COST,
      initialGold: INIT_GOLD,
      monsterSpawnInterval: INIT_MONSTER_SPAWN_INTERVAL,
    };
    const playerData = {
      gold: INIT_GOLD,
      base: INIT_BASE_DATA,
      highScore: playerHighScore,
      towers: [],
      monsters: [],
      monsterLevel: 0,
      score: 0,
      monsterPath: this.path,
      basePosition: this.path[this.path.length - 1],
    };
    const opponentData = {
      gold: INIT_GOLD,
      base: INIT_BASE_DATA,
      highScore: opponentHighScore,
      towers: [],
      monsters: [],
      monsterLevel: 0,
      score: 0,
      monsterPath: this.path,
      basePosition: this.path[this.path.length - 1],
    };

    this.users.forEach((user, index) => {
      let startPacket = null;
      if (userId === user.id)
        startPacket = gameStartNotification(initialGameState, playerData, opponentData);
      else startPacket = gameStartNotification(initialGameState, opponentData, playerData);
      user.socket.write(startPacket);
    });

    return true;
  }

  initMonsterPath(width, height) {
    const path = [];
    let currentX = 0;

    const amplitude = height / 3; // 진폭으로 상하 폭 결정
    const frequency = 0.025; // 주파수로 곡률 결정
    const phase = Math.random() * Math.PI * 2; // 위상으로 파형 결정 (시작 지점 변동)

    while (currentX <= width) {
      const sineY = height / 2 + amplitude * Math.sin(frequency * currentX + phase);
      const randomYChange = Math.floor(Math.random() * 100) - 50; // -50 ~ 50 범위의 랜덤 변화
      let currentY = sineY + randomYChange;

      // y 좌표에 대한 clamp 처리
      if (currentY < 230) {
        currentY = 230;
      }
      if (currentY > height) {
        currentY = height;
      }

      path.push({ x: currentX, y: currentY });

      currentX += Math.floor(Math.random() * 50) + 20;
    }

    return path;
  }

  getAllBaseHp(attackedUserId, attackedUserBaseHp) {
    this.users.forEach((user) => {
      let packet = null;
      if (user.id === attackedUserId) {
        packet = updateBaseHpNotification(false, attackedUserBaseHp);
      } else {
        packet = updateBaseHpNotification(true, attackedUserBaseHp);
      }
      user.socket.write(packet);
    });
  }

  gameOver() {

    for (const user of this.users) {
      let packet = null;
      if (user.baseHp > 0) {
        packet = gameOverNotification(true);
      } else {
        packet = gameOverNotification(false);
      }
      user.socket.write(packet);
    }
  }

}

export default Game;
