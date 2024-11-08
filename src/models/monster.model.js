import { userMonsterData } from './model.js';

// 매칭이 되어 게임이 실행되면 유저의 몬스터 세션 생성
export const createMonsterData = (userId) => {
  userMonsterData[userId] = [];
  userMonsterData[userId]['catchMonster'] = [];
  userMonsterData[userId]['attackedBase'] = [];
};

// 몬스터가 기지에서 자폭한 데이터 조회
export const getAttackedBase = (userId) => {
  if (!userMonsterData[userId]) {
    createMonsterData(userId);
  }
  return userMonsterData[userId].attackedBase;
};

// 몬스터가 기지에서 자폭한 데이터를 기록
export const setAttackedBase = (userId, damage, baseHp, timestamp) => {
  return userMonsterData[userId].attackedBase.push({
    damage,
    baseHp,
    timestamp,
  });
};

// 게임이 끝나면 유저의 몬스터 데이터 삭제
export const clearUserMosnterData = (userId) => {
  delete userMonsterData[userId];
};
