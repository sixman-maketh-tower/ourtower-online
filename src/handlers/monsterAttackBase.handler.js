import { getGameSessions } from '../session/game.session.js';
import { getUserById } from '../session/user.session.js';
import { createMonsterData, getAttackedBase, setAttackedBase } from '../models/monster.model.js';
import { getTotalAttackedDamage } from '../utils/monster/monster.util.js';

const monsterAttackBaseHandler = async ({ socket, userId, payload }) => {
  try {
    const { damage } = payload;

    const user = getUserById(userId);

    if (!user) {
      console.error('User not found');
    }

    // 유저가 들어있는 게임 세션을 찾아야함
    const gameSessions = getGameSessions();
    const gameSession = gameSessions.find((session) => session.users.includes(userId));

    if (!gameSession) {
      console.error('Game not found');
    }

    let userAttackedBase = getAttackedBase(userId);

    if (!userAttackedBase) {
      createMonsterData(userId);
      userAttackedBase = getAttackedBase(userId);
      if(!userAttackedBase) {
        console.error(`User's Monster Session not found`);
      }
    }

    // 몬스터 공격력이 적절한지 검증

    // 기지 체력량이 적절한지 검증
    const previousTotalDamage = getTotalAttackedDamage(userId);
    if (user.baseHp !== 100-previousTotalDamage){
      console.error(`Invalid baseHp`);
    }

    // 현재까지 몬스터 데미지의 총합 + 지금 받은 데미지
    const verifyDamage = previousTotalDamage + damage

    // 유저의 기지 체력을 몬스터 공격력만큼 감소
    user.attackedBase(damage);

    // 유저의 기지가 받은 피해를 기록
    setAttackedBase(userId, damage, user.baseHp, Date.now());

    // 기록된 데미지 총합을 기존 데이터와 비교해서 검증
    if (verifyDamage !== getTotalAttackedDamage(userId)){
      console.error(`Invalid damage`);
    }

    gameSession.getAllBaseHp(user.id, user.baseHp);
  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default monsterAttackBaseHandler;
