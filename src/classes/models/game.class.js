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

    const playerHighScore = await this.getUserHighScore(userId);

    const opponentUserId = this.getOpponentUserId(userId);
    const opponentHighScore = await this.getUserHighScore(opponentUserId);
    
    this.getUser(userId).state = config.game.state.playing;
    this.getUser(opponentUserId).state = config.game.state.playing;

    const player1 = this.getUser(userId);
    const player2 = this.getUser(opponentUserId);

    const initialGameState = {
      baseHp: INIT_BASE_HP,
      towerCost: INIT_TOWER_COST,
      initialGold: INIT_GOLD,
      monsterSpawnInterval: INIT_MONSTER_SPAWN_INTERVAL,
    };
    const playerData = {
      gold: player1.gold,
      base: INIT_BASE_DATA,
      highScore: playerHighScore,
      towers: player1.towers,
      monsters: [],
      monsterLevel: 0,
      score: player1.score,
      monsterPath: this.path,
      basePosition: this.path[this.path.length - 1],
    };
    const opponentData = {
      gold: player2.gold,
      base: INIT_BASE_DATA,
      highScore: opponentHighScore,
      towers: player2.towers,
      monsters: [],
      monsterLevel: 0,
      score: player2.score,
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

  initMonsterPath() {
    const path = [];

    let width = 100;
    let angle = 0;
    let isUp = false;
    const startPosition = { x: 0.0, y: 350.0 };
    const endPosition = { x: 1350.0, y: 350.0 };

    // 시작 위치와 끝 위치 설정
    for (let i = 0; i < 4; i++) {
      angle = i === 0 ? -Math.random() * 5 - 10 : Math.random() * 30 + 10;

      if (i === 3) {
        // 마지막 road의 각도는 base 위치와의 방향으로 설정
        const lastRoad = path[path.length - 1];
        const dx = endPosition.x - lastRoad.x;
        const dy = endPosition.y - lastRoad.y;
        const normal = Math.atan2(dy, dx) * (Math.PI / 180);
        angle = Math.abs(normal);
      }

      isUp = i === 0 ? (angle > 0 ? true : false) : !isUp;

      let newPos = { x: 0, y: 0 };
      for (let j = 0; j < 4; j++) {
        const realAngle = i === 0 && i === 3 ? angle : angle * (isUp ? 1 : -1);
        const rotatePos = {
          x: Math.cos((realAngle / 180) * Math.PI) * width,
          y: Math.sin((realAngle / 180) * Math.PI) * width,
        };

        if (i === 0 && j === 0) {
          newPos = startPosition;
        } else {
          newPos.x = path[path.length - 1].x + rotatePos.x;
          newPos.y = path[path.length - 1].y + rotatePos.y;
        }

        // y 좌표에 대한 clamp 처리
        if (newPos.y < 220) {
          newPos.y = 220;
        }
        if (newPos.y > 380) {
          newPos.y = 380;
        }
        console.log(`(${i}, ${j}) => realAngle: ${realAngle}, newPos: (${newPos.x}, ${newPos.y})`);
        // endPosition에 도달하거나 초과할 때 강제로 마지막 위치를 맞춤
        if (newPos.x >= endPosition.x) {
          path.push({ x: endPosition.x, y: endPosition.y });
          return path; // 정확히 끝 위치에서 종료
        }
        path.push({ x: newPos.x, y: newPos.y });
      }
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
