import { PACKET_TYPES } from '../../constants/packetTypes.js';
import { getServerGameAssets } from '../../init/assets.js';
import { getGame } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { spawnMonsterNotification } from '../../utils/notification/game.notification.js';
import { createResponse } from '../../utils/response/createResponse.js';

const spawnMonsterHandler = async ({ socket, payload }) => {
  // spawnMonsterRequest는 보내는 payload가 없다.

  const { monsters } = getServerGameAssets();

  const user = getUserBySocket(socket);
  const game = getGame(user.gameId);

  if(!game)
    return;

  const monsterId = game.getUniqueMonsterId();

  const monsterData = monsters.data.find((monster) => monster.type === game.monsterType);

  const spawnMonster = user.spawnMonster(monsterId, monsterData);

  const spawnMonsterResponse = createResponse(
    PACKET_TYPES.SPAWN_MONSTER_RESPONSE,
    {
      monsterId: spawnMonster.id,
      monsterNumber: spawnMonster.type,
    },
  );

  /** Debug용 Log : 몬스터 스폰*/
  console.log(`[${user.id}] User => Spawn Monster (${monsterId})`);

  user.socket.write(spawnMonsterResponse);

  const opponent = game.getOpponentUser(user.id);

  const spawnMonsterNotificationPacket = spawnMonsterNotification(
    spawnMonster.id,
    spawnMonster.type,
  );
  opponent.socket.write(spawnMonsterNotificationPacket);
};

export default spawnMonsterHandler;
