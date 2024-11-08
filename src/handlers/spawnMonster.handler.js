import { PACKET_TYPE_NAMES, PACKET_TYPES } from '../constants/packetTypes.js';
import { getGameSessions } from '../session/game.session.js';
import { getUserBySocket } from '../session/user.session.js';
import { spawnMonsterNotification } from '../utils/notification/game.notification.js';
import { createResponse } from '../utils/response/createResponse.js';

let monsterUniqueId = 0;

const spawnMonsterHandler = async ({ socket, userId, payload }) => {
  const monsterId = monsterUniqueId++;
  const monsterNumber = 1;

  // user (player)
  const player = getUserBySocket(socket);

  const gameSession = getGameSessions().find((game) => game.users.includes(player));

  const spawnMonsterResponse = createResponse(PACKET_TYPES.SPAWN_MONSTER_RESPONSE, {
    monsterId,
    monsterNumber,
  });
  player.socket.write(spawnMonsterResponse);

  // opponent
  const opponent = gameSession.users.find((user) => user.id !== player.id);

  const spawnMonsterNotificationPacket = spawnMonsterNotification(monsterId, monsterNumber);
  opponent.socket.write(spawnMonsterNotificationPacket);
};

export default spawnMonsterHandler;
