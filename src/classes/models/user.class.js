import { config } from "../../config/config.js";

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.gold = config.game.initData.gold;
    this.baseHp = config.game.initData.baseHp;
    this.state = config.game.state.waiting;
  }

  getNextSequence() {
    return ++this.sequence;
  }
  
  attackedBase(damage) {
    this.baseHp -= damage;
    this.lastUpdateTime = Date.now();
  }

}

export default User;
