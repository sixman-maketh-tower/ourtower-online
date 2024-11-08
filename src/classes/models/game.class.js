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
import { gameStartNotification } from '../../utils/notification/game.notification.js';

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

  // getUserHighScore(userId) {
  //   const userData = getUserById(userId);
  //   const userHighScore = userData.highScore;
  //   return userHighScore;
  // }

  startGame(userId) {
    if (this.users.length !== config.game.maxPlayer) {
      return false;
    }

    this.state = config.game.state.playing;
    this.path = this.initMonsterPath();

    // const playerHighScore = this.getUserHighScore(userId);
    // const opponentHighScore = this.getUserHighScore(opponentUserId);

    const initialGameState = {
      baseHp: INIT_BASE_HP,
      towerCost: INIT_TOWER_COST,
      initialGold: INIT_GOLD,
      monsterSpawnInterval: INIT_MONSTER_SPAWN_INTERVAL,
    };

    const playerData = {
      gold: player1.gold,
      base: INIT_BASE_DATA,
      highScore: 0,
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
      highScore: 0,
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

    let width = 60;
    let angle = 0;
    let isUp = false;
    const startPosition = { x: 0.0, y: 350.0 };
    const endPosition = { x: 1350.0, y: 350.0 };

    // 시작 위치와 끝 위치 설정
    for (let i = 0; i < 4; i++) {
      angle = i === 0 ? -Math.random() * 5 - 10 : Math.random() * 30 + 15;

      if (i === 3) {
        // 마지막 road의 각도는 base 위치와의 방향으로 설정
        const lastRoad = path[path.length - 1];
        const dx = endPosition.x - lastRoad.x;
        const dy = endPosition.y - lastRoad.y;
        const normal = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = Math.abs(normal);
      }

      isUp = i === 0 ? (angle > 0 ? true : false) : !isUp;

      let newPos = { x: 0, y: 0 };
      for (let j = 0; j < (i < 3 ? 7 : 8); j++) {
        const realAngle = i === 0 ? angle : angle * (isUp ? 1 : -1);
        const rotatePos = {
          x: Math.cos((realAngle / 180) * Math.PI) * width,
          y: Math.sin((realAngle / 180) * Math.PI) * width,
        };

        if (i === 0 && j === 0) {
          console.log(`${i}, ${j} => realAngle: ${realAngle}`);
          newPos = startPosition;
        } else if (i !== 0 && j === 0) {
          newPos.x = path[path.length - 1].x;
          newPos.y = path[path.length - 1].y;
        } else {
          newPos.x = path[path.length - 1].x + rotatePos.x;
          newPos.y = path[path.length - 1].y + rotatePos.y;
        }

        path.push({ x: newPos.x, y: newPos.y });
      }
    }

    return path;
  }

  // let currentX = 0;

  // const amplitude = height / 3; // 진폭으로 상하 폭 결정
  // const frequency = 0.025; // 주파수로 곡률 결정
  // const phase = Math.random() * Math.PI * 2; // 위상으로 파형 결정 (시작 지점 변동)

  // while (currentX <= width) {
  //   const sineY = height / 2 + amplitude * Math.sin(frequency * currentX + phase);
  //   const randomYChange = Math.floor(Math.random() * 100) - 50; // -50 ~ 50 범위의 랜덤 변화
  //   let currentY = sineY + randomYChange;

  //   // y 좌표에 대한 clamp 처리
  //   if (currentY < 230) {
  //     currentY = 230;
  //   }
  //   if (currentY > height) {
  //     currentY = height;
  //   }

  //   path.push({ x: currentX, y: currentY });

  //   currentX += Math.floor(Math.random() * 50) + 20;
  // }
  // const roads = [];
  // let maxWidth = 1280;
  // let sprite = 50;
  // let angle = 0;
  // let rotation = 0;
  // let isUp = false;
  // const startPosition = { x: 10, y: 410 };
  // const endPosition = { x: 1280, y: 410 };

  // let currentX = 10;
  // let currentY = 410;

  // // 시작 위치와 끝 위치 설정
  // for (let i = 0; i < 4; i++) {
  //   if (i === 0) {
  //     angle = Math.floor(Math.random() * 91) - 45;
  //   }
  //   if (i === 3) {
  //     // 마지막 road의 각도는 base 위치와의 방향으로 설정
  //     const lastRoad = roads[roads.length - 1];
  //     const dx = endPosition.x - lastRoad.x;
  //     const dy = endPosition.y - lastRoad.y;
  //     const normal = Math.atan2(dy, dx) * (180 / Math.PI);
  //     angle = Math.abs(normal);
  //   } else {
  //     angle = Math.floor(Math.random() * 31) + 15;
  //   }

  // let currentX = 10;
  // let currentY = Math.floor(Math.random() * 21) + 400; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  // path.push({ x: currentX, y: currentY });

  // while (currentX < width) {
  //   currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
  //   // x 좌표에 대한 clamp 처리
  //   if (currentX < 0) {
  //     currentX = 0;
  //   }
  //   if (currentX > width) {
  //     currentX = width;
  //   }

  //   currentY += Math.floor(Math.random() * 200) - 100; // -100 ~ 100 범위의 y 변경
  //   // y 좌표에 대한 clamp 처리
  //   if (currentY < 0) {
  //     currentY = 0;
  //   }
  //   if (currentY > height) {
  //     currentY = height;
  //   }

  //   path.push({ x: currentX, y: currentY });
  // }

  // return path;
}

export default Game;
