import { PACKET_TYPES } from '../constants/packetTypes.js';
import { getGameSessions } from '../session/game.session.js';
import { getUserBySocket } from '../session/user.session.js';
import { spawnMonsterNotification } from '../utils/notification/game.notification.js';
import { createResponse } from '../utils/response/createResponse.js';

let monsterUniqueId = 0;

const spawnMonsterHandler = async ({ socket, userId, payload }) => {
  const monsterId = monsterUniqueId++;
  const monsterNumber = 1;

  const player = getUserBySocket(socket);

//   console.log(`몬스터 생성 요청한 유저: ${player.id}`);

  const gameSession = getGameSessions().find((game) => game.users.includes(player));

  const opponent = gameSession.users.find((user) => user.id !== player.id);

  const spawnMonsterResponse = createResponse(PACKET_TYPES.SPAWN_MONSTER_RESPONSE, {
    monsterId,
    monsterNumber,
  });
  // player.score += 100;
  // console.log(player.score);

  player.socket.write(spawnMonsterResponse);

  const spawnMonsterNotificationPacket = spawnMonsterNotification(monsterId, monsterNumber);
  opponent.socket.write(spawnMonsterNotificationPacket);
};

export default spawnMonsterHandler;