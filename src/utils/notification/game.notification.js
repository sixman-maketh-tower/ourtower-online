import { getProtoMessages } from '../../init/proto.js';
import { PACKET_TYPE_NAMES, PACKET_TYPES } from '../../constants/packetTypes.js';
import { createHeader } from '../header/createHeader.js';

const makeNotification = (message, type) => {
  const headerBuffer = createHeader(type, message, 1);

  return Buffer.concat([headerBuffer, message]);
};

export const gameStartNotification = (initialGameState, playerData, opponentData) => {
  const protoMessages = getProtoMessages();
  const gamePacket = protoMessages.GamePacket;

  const startPacketTypeName = PACKET_TYPE_NAMES[PACKET_TYPES.MATCH_START_NOTIFICATION];

  const payload = {};
  payload[startPacketTypeName] = { initialGameState, playerData, opponentData };

  const startPacket = gamePacket.encode(payload).finish();

  return makeNotification(startPacket, PACKET_TYPES.MATCH_START_NOTIFICATION);
};

export const spawnMonsterNotification = (monsterId, monsterNumber) => {
  const protoMessages = getProtoMessages();
  const gamePacket = protoMessages.GamePacket;

  const spawnMonsterTypeName = PACKET_TYPE_NAMES[PACKET_TYPES.SPAWN_ENEMY_MONSTER_NOTIFICATION];

  const payload = {};
  payload[spawnMonsterTypeName] = {
    monsterId,
    monsterNumber,
  };

  const spawnMonsterPacket = gamePacket.encode(payload).finish();

  return makeNotification(spawnMonsterPacket, PACKET_TYPES.SPAWN_ENEMY_MONSTER_NOTIFICATION);
};
