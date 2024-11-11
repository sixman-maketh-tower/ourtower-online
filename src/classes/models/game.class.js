import { config } from '../../config/config.js';
import { GameState, initialState } from '../../utils/packet/gamePacket.js';
import {
  gameStartNotification,
  gameOverNotification,
  updateBaseHpNotification,
} from '../../utils/notification/game.notification.js';
import IntervalManager from '../managers/interval.manager.js';
import { findHighScoreByUserId, updateHighScore } from '../../db/user/user.db.js';
import { clearUserMonsterData } from '../../models/monster.model.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = config.game.state.waiting;
    this.path = [];

    this.monsterUniqueId = 0;
    this.towerUniqueId = 0;

    this.monsterType = 1;

    this.intervalManager = new IntervalManager();
  }

  init() {
    // 유저 초기화
    this.users.forEach((user) => {
      user.init();
      clearUserMonsterData(user.id);
  });

    // 게임 초기화
  }


  // Game에 User가 참가
  addUser(user) {
    this.users.push(user);
    user.gameId = this.id;

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

  getOpponentUser(userId) {
    const opponentUser = this.users.find((user) => user.id !== userId);
    return opponentUser;
  }

  getUniqueMonsterId() {
    return this.monsterUniqueId++;
  }

  getUniqueTowerId() {
    return this.towerUniqueId++;
  }

  async getUserHighScore(userId) {
    const dbUserHighScore = await findHighScoreByUserId(userId);
    return dbUserHighScore;
  }

  async startGame(userId) {
    if (this.users.length !== config.game.maxPlayer) {
      return false;
    }

    // 시작하기 전에 초기화
    this.init();

    this.state = config.game.state.playing;
    this.monsterType = 1;
    this.path = this.initMonsterPath();
    this.intervalManager.addMonsterTypeInterval(this.id, this.changeMonsterType.bind(this), 10000);

    const playerHighScore = await this.getUserHighScore(userId);

    const opponentUserId = this.getOpponentUserId(userId);
    const opponentHighScore = await this.getUserHighScore(opponentUserId);

    this.getUser(userId).state = config.game.state.playing;
    this.getUser(opponentUserId).state = config.game.state.playing;

    const player1 = this.getUser(userId);
    const player2 = this.getUser(opponentUserId);

    const initialGameState = initialState();
    const playerData = GameState(player1, this.path, playerHighScore);
    const opponentData = GameState(player2, this.path, opponentHighScore);

    this.users.forEach((user, index) => {
      let startPacket = null;
      if (userId === user.id)
        startPacket = gameStartNotification(
          initialGameState,
          playerData,
          opponentData,
        );
      else
        startPacket = gameStartNotification(
          initialGameState,
          opponentData,
          playerData,
        );

      user.socket.write(startPacket);
    });

    console.log("GameStart");

    return true;
  }

  initMonsterPath() {
    const path = [];

    let width = 100;
    let angle = 0;
    let isUp = false;
    const startPosition = { x: 0.0, y: 240.0 };
    const endPosition = { x: 1350.0, y: 350.0 };

    // 시작 위치와 끝 위치 설정
    for (let i = 0; i < 4; i++) {
      angle = i === 0 ? -Math.random() * 5 - 10 : Math.random() * 30 + 10;

      if (i === 3) {
        // 마지막 road의 각도는 base 위치와의 방향으로 설정
        const lastRoad = path[path.length - 1];
        const dx = endPosition.x - lastRoad.x;
        const dy = endPosition.y - lastRoad.y;
        const normal = Math.atan2(dy, dx);
        angle = Math.abs((normal * 180) / Math.PI);
      }

      isUp = i === 0 ? (angle > 0 ? true : false) : !isUp;

      let newPos = { x: 0, y: 0 };
      for (let j = 0; j < 4; j++) {
        const realAngle = i === 0 && i === 3 ? angle : angle * (isUp ? 1 : -1);
        const rotatePos = {
          x: Math.cos((realAngle * Math.PI) / 180) * width,
          y: Math.sin((realAngle * Math.PI) / 180) * width,
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
        // console.log(
        //   `(${i}, ${j}) => realAngle: ${realAngle}, newPos: (${newPos.x}, ${newPos.y})`,
        // );
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
      const packet = gameOverNotification(user.winLose);
      user.socket.write(packet);
    }
  }

  changeMonsterType() {
    if (this.monsterType < 5)
      this.monsterType += 1;
  }

  async updateScore(user, opponentUser) {
    if (user.score > (await findHighScoreByUserId(user.id))) {
      await updateHighScore(user.score, user.id);
      console.log(await findHighScoreByUserId(user.id));
    }
    if (opponentUser.score > (await findHighScoreByUserId(opponentUser.id))) {
      await updateHighScore(opponentUser.score, opponentUser.id);
      console.log(await findHighScoreByUserId(opponentUser.id));
    }
  }
}

export default Game;
