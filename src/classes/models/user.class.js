class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.sequence = 0;
    this.score = 0;
    this.gold = 0;
    this.baseHp = 100; // 게임세션 생성 시 init으로 초기화해야할듯?
  }

  getNextSequence() {
    return ++this.sequence;
  }

  gameOver() {

  }

  attackedBase(damage) {
    this.baseHp -= damage;
    this.lastUpdateTime = Date.now();
  }
  
  updateBaseHp(baseHp) {
    this.baseHp = baseHp;
    this.lastUpdateTime = Date.now(); 
  }
}

export default User;
