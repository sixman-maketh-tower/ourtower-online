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
    this.users.push(user);

    if (this.users.length >= config.game.maxPlayer) {
      // throw new Error('게임 인원이 가득 차 참가하실 수 없습니다.');
    }

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

    console.log('중간 목표 달성');
    /*
 message Position {
  float x = 1;
  float y = 2;
}

message BaseData {
  int32 hp = 1;
  int32 maxHp = 2;
}

message TowerData {
  int32 towerId = 1;
  float x = 2;
  float y = 3;
}

message MonsterData {
  int32 monsterId = 1;
  int32 monsterNumber = 2;
  int32 level = 3;
}

message InitialGameState {
  int32 baseHp = 1;
  int32 towerCost = 2;
  int32 initialGold = 3;
  int32 monsterSpawnInterval = 4;
}   
    
message InitialGameState {
  int32 baseHp = 1;
  int32 towerCost = 2;
  int32 initialGold = 3;
  int32 monsterSpawnInterval = 4;
}

message GameState {
  int32 gold = 1;
  BaseData base = 2;
  int32 highScore = 3;
  repeated TowerData towers = 4;
  repeated MonsterData monsters = 5;
  int32 monsterLevel = 6;
  int32 score = 7;
  repeated Position monsterPath = 8;
  Position basePosition = 9;
}

message S2CMatchStartNotification {
    InitialGameState initialGameState = 1;
    GameState playerData = 2;
    GameState opponentData = 3;
}

message S2CStateSyncNotification {
    int32 userGold = 1;
    int32 baseHp = 2;
    int32 monsterLevel = 3;
    int32 score = 4;
    repeated TowerData towers = 5;
    repeated MonsterData monsters = 6;
}
*/
    const initialGameState = {
      baseHp: 100,
      towerCost: 10,
      initialGold: 100,
      monsterSpawnInterval: 100,
    };
    const playerData = {
      gold: 100,
      base: 100,
      highScore: 0,
      towers: [],
      monsters: [],
      monsterLevel: 0,
      score: 0,
      monsterPath: [],
      basePosition: { x: 0, y: 0 },
    };
    const opponentData = {
      gold: 100,
      base: 100,
      highScore: 0,
      towers: [],
      monsters: [],
      monsterLevel: 0,
      score: 0,
      monsterPath: [],
      basePosition: { x: 0, y: 0 },
    };

    const startPacket = gameStartNotification(initialGameState, playerData, opponentData);

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }
}

export default Game;
