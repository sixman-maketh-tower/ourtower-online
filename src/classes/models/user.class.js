import Tower from './tower.class.js';
import { config } from '../../config/config.js';
import Monster from './monster.class.js';
import { MAX_MONSTER_LEVEL } from '../../constants/game.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();

    this.state = config.game.state.waiting;
    this.gameId = null;
    this.gold = config.game.initData.gold;
    this.baseHp = config.game.initData.baseHp;
    this.score = 0;
    this.winLose = true;

    this.towers = [];
    this.monsters = [];
  }

  init() {
    this.state = config.game.state.waiting;
    this.gold = config.game.initData.gold;
    this.baseHp = config.game.initData.baseHp;
    this.score = 0;
    this.winLose = true;

    this.towers = [];
    this.monsters = [];
  }

  getNextSequence() {
    return ++this.sequence;
  }

  getAllTowers = () => {
    return this.towers;
  };

  bindTower = (id, x, y, data) => {
    const tower = new Tower(id, x, y, data);
    this.towers.push(tower);

    return tower;
  };

  attackedBase(damage) {
    this.baseHp -= damage;
    this.lastUpdateTime = Date.now();
  }

  spawnMonster(id, monsterData) {
    // 몬스터 레벨은 1 ~ 10 중 랜덤한 수치
    const randomLevel = Math.floor(Math.random() * config.game.maxMonsterLevel) + 1;
    console.log(`randomLevel: ${randomLevel}, ${config.game.maxMonsterLevel}`);
    const monster = new Monster(id, randomLevel, monsterData);
    this.monsters.push(monster);

    return monster;
  }

  getMonster(monsterId) {
    const monsterIndex = this.monsters.findIndex((monster) => monster.id === monsterId);
    return monsterIndex;
  }

  removeMonster(monsterIndex) {
    const removeMonster = this.monsters.splice(monsterIndex, 1)[0];
    return removeMonster;
  }

  catchMonster(monster) {
    this.gold += monster.gold;
    this.score += monster.score;
  }
}

export default User;
