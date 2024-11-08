import { INIT_BASE_HP } from "../../constants/game.js";

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.gold = 0;
    this.baseHp = INIT_BASE_HP;
  }

  getNextSequence() {
    return ++this.sequence;
  }
  
  attackedBase(damage) {
    this.baseHp -= damage;
    this.lastUpdateTime = Date.now();
  }

  getBaseHp() {
    return this.baseHp;
  }
}

export default User;
