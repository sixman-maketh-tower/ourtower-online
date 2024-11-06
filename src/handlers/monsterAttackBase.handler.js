import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { getGame } from '../session/game.session.js';
import { getUserById } from '../session/user.session.js';
import { createMonsterSession, getAttackedBase, setAttackedBase } from '../session/monster.session.js';
import { getTotalAttackedDamage } from '../utils/monster.util.js';

const monsterAttackBaseHandler = async ({ socket, userId, payload }) => {
  try {
    const { gameId, damage } = payload;
    const gameSession = getGame(gameId);

    if (!gameSession) {
      console.error('Game not found');
    }

    const user = getUserById(userId);

    if (!user) {
      console.error('User not found');
    }

    let userAttackedBase = getAttackedBase(userId);

    if (!userAttackedBase) {
      createMonsterSession(userId);
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

    // 유저의 기지 체력이 0 이하인가를 여기서 처리?

    const monsterAttackBaseResponse = createResponse(PACKET_TYPES.MONSTER_ATTACK_BASE_REQUEST, {
      success: 0,
      message: 'success',
      failCode: 0,
    });

    socket.write(monsterAttackBaseResponse);
  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default monsterAttackBaseHandler;
