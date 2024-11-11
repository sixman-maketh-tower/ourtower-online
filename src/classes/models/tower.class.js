class Tower {
  constructor(id, x, y, data) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = data.type;
    this.power = data.attack_power;
    this.cost = data.cost;
  }

  // tower가 공격한 monster가 사망했다면 false 반환
  attack(monster) {
    const monsterAlive = monster.attacked(this.power);

    return monsterAlive;
  }
}

export default Tower;
