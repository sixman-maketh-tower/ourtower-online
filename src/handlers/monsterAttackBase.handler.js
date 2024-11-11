import { getGameSessions, removeGame } from '../session/game.session.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import {
  getAttackedBase,
  setAttackedBase,
} from '../models/monster.model.js';
import { getTotalAttackedDamage } from '../utils/monster/monster.util.js';
import { config } from '../config/config.js';
import { findHighScoreByUserId, updateHighScore } from '../db/user/user.db.js';

const monsterAttackBaseHandler = async ({ socket, userId, payload }) => {
  try {
    const { damage } = payload;

    const user = getUserBySocket(socket);
    // console.log(user);

    if (!user) {
      console.error('User not found');
    }

    // 유저가 들어있는 게임 세션을 찾아야함
    const gameSessions = getGameSessions();
    const gameSession = gameSessions.find((session) =>
      session.users.includes(user),
    );

    if(!gameSession)
      return;

    let userAttackedBase = getAttackedBase(user.id);

    if (!userAttackedBase) {
      console.error(`User's Monster Data not found`);
    }

    if (!gameSession) {
      console.error('Game not found');
    }
    
    // 기지 체력량이 적절한지 검증
    const previousTotalDamage = getTotalAttackedDamage(user.id);
    if (user.baseHp !== config.game.initData.baseHp - previousTotalDamage) {
      console.error(`Invalid baseHp`);
    }

    // 현재까지 몬스터 데미지의 총합 + 지금 받은 데미지
    const verifyDamage = previousTotalDamage + damage;

    // 유저의 기지 체력을 몬스터 공격력만큼 감소
    user.attackedBase(damage);

    // 유저의 기지가 받은 피해를 기록
    setAttackedBase(user.id, damage, user.baseHp, Date.now());

    // console.log(verifyDamage);
    // console.log(getTotalAttackedDamage(user.id));
    // 기록된 데미지 총합을 기존 데이터와 비교해서 검증
    if (verifyDamage !== getTotalAttackedDamage(user.id)) {
      console.error(`Invalid damage`);
    }

    gameSession.getAllBaseHp(user.id, user.baseHp);

  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default monsterAttackBaseHandler;
