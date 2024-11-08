import { config } from '../../config/config.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.gold = 3152;
    this.towers = [];
    this.state = config.game.state.waiting;
  }

  getNextSequence() {
    return ++this.sequence;
  }
}

export default User;
