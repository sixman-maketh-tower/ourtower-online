import { getGame } from '../session/game.session.js';
import { getUserBySocket } from '../session/user.session.js';
import { deathMonsterNotification } from '../utils/notification/game.notification.js';

const deathMonsterHandler = async ({ socket, userId, payload }) => {
  const { monsterId } = payload;

  const user = getUserBySocket(socket);
  const game = getGame(user.gameId);

  const monsterIndex = user.getMonster(monsterId);
  if (monsterIndex === -1) {
    console.error(`Not Found Monster`);
  }

  /** Debug용 Log : 몬스터 스폰*/
  console.log(
    `[${user.id}] User => Die Monster (${user.monsters[monsterIndex].id})`,
  );

  const opponent = game.getOpponentUser(user.id);

  const deathMonsterNotificationPacket = deathMonsterNotification(monsterId);
  opponent.socket.write(deathMonsterNotificationPacket);
};

export default deathMonsterHandler;
