import { INIT_MONSTER_SPAWN_INTERVAL } from '../constants/game.js';
import { PACKET_TYPES } from '../constants/packetTypes.js';
import { getServerGameAssets } from '../init/assets.js';
import { getGame } from '../session/game.session.js';
import { getUserBySocket } from '../session/user.session.js';
import {
  addEnemyTowerNotification,
  enemyTowerAttackNotification,
  stateSyncNotification,
} from '../utils/notification/game.notification.js';
import { createResponse } from '../utils/response/createResponse.js';

export const towerPurchaseHandler = async ({ socket, userId, payload }) => {
  // 유저가 접속한 게임세션 찾기
  // 게임에 속한 유저 데이터 중 towers 배열에 구매요청한 타워 추가
  // 타워구매 응답패킷 만들어 클라이언트에 반환

  const { x, y } = payload;
  const { towers } = getServerGameAssets();

  // 게임세션 안에 있는 유저를 찾는 것
  const user = getUserBySocket(socket);
  if (!user) {
    console.error('유저가 존재하지 않습니다.');
  }

  const game = getGame(user.gameId);

  const towerUniqueId = game.getUniqueTowerId();
  const towerData = towers.data[0];
  // 타워 추가
  const newTower = user.bindTower(towerUniqueId, x, y, towerData);

  // 유저의 골드를 tower 비용만큼 차감
  user.gold -= towerData.cost;
  /** Debug용 Log : tower 구입*/
  console.log(`[${user.id}] User => Purchase Tower (${user.towers.length})`);

  // 요청한 유저에게 타워 구매 응답
  const towerPurchaseResponse = createResponse(
    PACKET_TYPES.TOWER_PURCHASE_RESPONSE,
    {
      towerId: newTower.id,
    },
  );
  socket.write(towerPurchaseResponse);

  const enemy = game.getOpponentUser(user.id);
  // 상대방 유저에게 타워 구매 중계
  const enemyTowerAddNotification = addEnemyTowerNotification(
    newTower.id,
    x,
    y,
  );
  enemy.socket.write(enemyTowerAddNotification);
};

export const towerAttackHandler = async ({ socket, userId, payload }) => {
  const { towerId, monsterId } = payload;

  const user = getUserBySocket(socket);
  const game = getGame(user.gameId);

  // console.log('--------------------------------------------');
  // console.log(towerId, monsterId, user.id);
  // console.log(user.towers);
  // console.log(user.monsters);
  // console.log('--------------------------------------------');

  const userTower = user.towers.find((tower) => tower.id === towerId);
  if (!userTower) {
    console.log('Not exist Tower');
  }

  const userMonster = user.monsters.find((monster) => monster.id === monsterId);
  if (!userMonster) {
    console.log('Not exist Monster');
  }

  /** Debug용 Log : 타워 공격*/
  console.log(
    `[${user.id}] User => Attack : Tower(${userTower.id}) -> Monster(${userMonster.id})`,
  );

  let dieMonster;
  const monsterAlive = userTower.attack(userMonster);
  if (!monsterAlive) {
    const monsterIndex = user.getMonster(monsterId);

    dieMonster = user.removeMonster(monsterIndex);
    console.log(`${dieMonster.id} Monster Die`);
  }

  const opponent = game.getOpponentUser(user.id);

  const towerAttackNotification = enemyTowerAttackNotification(
    towerId,
    monsterId,
  );

  opponent.socket.write(towerAttackNotification);

  // 몬스터 사망 시, 유저에게 score를 올려준다.
  if (!monsterAlive && dieMonster) {
    user.catchMonster(dieMonster);

    const stateSyncNotificationPacket = stateSyncNotification(game, user);
    socket.write(stateSyncNotificationPacket);
  }
};
