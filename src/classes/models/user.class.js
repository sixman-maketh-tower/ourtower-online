class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.gold = 0;
    this.towerUniqueId = 0;
  }

  getNextSequence() {
    return ++this.sequence;
  }
}

export default User;
