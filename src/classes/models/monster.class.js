class Monster {
  constructor(id, level, data) {
    this.id = id;
    this.type = data.type;
    this.level = level;
    this.hp = data.hp + data.hpPerLv * (level - 1);
    this.power = data.power + data.powerPerLv * (level - 1);
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
