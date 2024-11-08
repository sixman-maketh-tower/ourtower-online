import { addEnemyTowerNotification } from "../../utils/notification/game.notification.js";
import Tower from "./tower.class.js";

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.gold = 3000;
    this.towers = [];
    this.towerUniqueId = 0;
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
  
  // 
    bindTower = (socket, x, y) => {
     const tower = new Tower(x, y, this.towerUniqueId++);
     this.towers.push(tower);

     console.log('towerId?:', this.towerUniqueId)

     socket.write(addEnemyTowerNotification(this.towerUniqueId, x, y))
    return tower;
  };
}

export default User;
