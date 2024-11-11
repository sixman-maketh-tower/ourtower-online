class Monster {
  constructor(id, data) {
    this.id = id;
    this.type = data.type;
    this.level = data.level;
    this.hp = data.hp;
    this.power = data.power;
    this.gold = data.gold;
    this.score = data.score;
  }

  // damage 받고 사망한다면 false 반환
  attacked(damage) {
    this.hp -= damage;

    if (this.hp <= 0) return false;
    return true;
  }
}

export default Monster;