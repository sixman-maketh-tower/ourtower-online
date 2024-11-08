import Tower from "./tower.class.js";

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.gold = 0;
    this.towers = [];
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
  
    bindTower = (payload, userId) => {
     const { x, y } = payload;
     const coordinateX = x;
     const coordinateY = y;
     const tower = new Tower(coordinateX, coordinateY, userId)
    return this.towers.push(tower);
  };
}

export default User;
