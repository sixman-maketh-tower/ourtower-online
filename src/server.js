import net from 'net';
import { config } from './config/config.js';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { monsterSessions } from './session/session.js';
import {
  createMonsterSession,
  getAttackedBase,
  setAttackedBase,
} from './session/monster.session.js';
import { getTotalAttackedDamage } from './utils/monster.util.js';
import { addUser, getUserById } from './session/user.session.js';

const server = net.createServer(onConnection);
// console.log(monsterSessions);

// const userId = 1111;


// // console.log(monsterSessions[1111]);
// console.log(getAttackedBase(userId));
// console.log(getTotalAttackedDamage(userId));

addUser('1231sad', 1111);

const user = getUserById(1111);
console.log(user);

let damage = 1;
const timestamp = Date.now();

createMonsterSession(user.id);

for (let i = 0; i < 5; i++) {
  damage += 1;
  user.attackedBase(damage);
  setAttackedBase(user.id, damage, user.baseHp, timestamp);
  console.log(user);
}

// 현재까지 몬스터 데미지의 총합 + 지금 받은 데미지
const previousTotalDamage = getTotalAttackedDamage(user.id);
let verifyDamage = previousTotalDamage + damage;

// 유저의 기지 체력을 몬스터 공격력만큼 감소
user.attackedBase(damage);
console.log(`${damage}의 피해!`);

// 유저의 기지가 받은 피해를 기록
setAttackedBase(user.id, damage, user.baseHp, Date.now());

// 새로운 피해까지 추가한 총합과 비교
if (verifyDamage !== getTotalAttackedDamage(user.id)) {
  console.error(`Invalid damage`);
}

console.log(`verifyDamage: ${previousTotalDamage} + ${damage}`);
console.log(`데미지 총합: ${getTotalAttackedDamage(user.id)}`);
console.log(`남은 체력: ${user.baseHp}`);


initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행되었습니다.`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
