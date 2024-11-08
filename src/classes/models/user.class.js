import { addEnemyTowerNotification } from '../../utils/notification/game.notification.js';
import Tower from './tower.class.js';
import { config } from '../../config/config.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.towers = [];
    this.gold = config.game.initData.gold;
    this.baseHp = config.game.initData.baseHp;
    this.towerUniqueId = 0;
    this.state = config.game.state.waiting;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  initializeTower = () => {
    this.towers = [];
  };

  getAllTowers = () => {
    return this.towers;
  };

  towerNumber = () => {
    return this.towers.length;
  };

  bindTower = (socket, x, y) => {
    const tower = new Tower(x, y, this.towerUniqueId++);
    this.towers.push(tower);

    console.log('towerId?:', this.towerUniqueId);

    socket.write(addEnemyTowerNotification(this.towerUniqueId, x, y));
    return tower;
  };

  attackedBase(damage) {
    this.baseHp -= damage;
    this.lastUpdateTime = Date.now();
  }
}

export default User;
