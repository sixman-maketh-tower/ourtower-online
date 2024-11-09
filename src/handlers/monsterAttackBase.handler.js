import { getGameSessions, removeGame } from '../session/game.session.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import {
  clearUserMosnterData,
  createMonsterData,
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

    if (gameSession) {
      let userAttackedBase = getAttackedBase(user.id);

      if (!userAttackedBase) {
        createMonsterData(userId);
        userAttackedBase = getAttackedBase(user.id);
        if (!userAttackedBase) {
          console.error(`User's Monster Session not found`);
        }
      }

      // 몬스터 공격력이 적절한지 검증

      // 기지 체력량이 적절한지 검증
      const previousTotalDamage = getTotalAttackedDamage(user.id);
      if (user.baseHp !== config.game.initData.baseHp - previousTotalDamage) {
        console.error(`Invalid baseHp`);
      }

      // 현재까지 몬스터 데미지의 총합 + 지금 받은 데미지
      const verifyDamage = previousTotalDamage + damage;

      // 유저의 기지 체력을 몬스터 공격력만큼 감소
      user.attackedBase(damage);

      /** Debug용 Log : 몬스터 기지 공격*/
      console.log(
        `[${user.id}] User => Base Attacked (${user.baseHp})(${damage} Damage)`,
      );

      // 유저의 기지가 받은 피해를 기록
      setAttackedBase(user.id, damage, user.baseHp, Date.now());

      // console.log(verifyDamage);
      // console.log(getTotalAttackedDamage(user.id));
      // 기록된 데미지 총합을 기존 데이터와 비교해서 검증
      if (verifyDamage !== getTotalAttackedDamage(user.id)) {
        console.error(`Invalid damage`);
      }
      //console.log(getTotalAttackedDamage(user.id));

      gameSession.getAllBaseHp(user.id, user.baseHp);

      const opponentUser = gameSession.users.find(
        (findUser) => findUser.id !== user.id,
      );
      if (user.baseHp <= 0) {
        if (user.score > (await findHighScoreByUserId(user.id))) {
          await updateHighScore(user.score, user.id);
          console.log(await findHighScoreByUserId(user.id));
        }
        if (user.score > (await findHighScoreByUserId(opponentUser.id))) {
          await updateHighScore(opponentUser.score, opponentUser.id);
          console.log(await findHighScoreByUserId(opponentUser.id));
        }

        // console.log('세션 종료');
        await gameSession.gameOver();

        // 게임 데이터 정보 초기화
        user.gold = config.game.initData.gold;
        user.baseHp = config.game.initData.baseHp;
        user.score = 0;
        user.state = config.game.state.waiting;
        clearUserMosnterData(user.id);

        opponentUser.gold = config.game.initData.gold;
        opponentUser.baseHp = config.game.initData.baseHp;
        opponentUser.score = 0;
        opponentUser.state = config.game.state.waiting;
        clearUserMosnterData(opponentUser.id);
        removeGame(gameSession.id);
      }
    }
  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default monsterAttackBaseHandler;
