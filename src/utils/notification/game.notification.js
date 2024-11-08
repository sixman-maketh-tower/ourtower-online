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

// ? 적의 포탑이 내쪽 화면에 뿌려지는 용도여야함 - 지금은 내 포탑위치랑 똑같은 포탑이 적에게도 스폰됨 (적에게 노티 가지 않음)
//  1. x, y 자체를 상대의 정보로 받아와서 나한테 뿌려주거나
//  2. x, y는 내 정보가 맞는데 상대한테 뿌려주는 것으로 해야 하거나

export const addEnemyTowerNotification = (towerId, x, y) => {
  const protoMessages = getProtoMessages();
  const gamePacket = protoMessages.GamePacket;

  const packetTypeName = PACKET_TYPE_NAMES[PACKET_TYPES.ADD_ENEMY_TOWER_NOTIFICATION];

  const payload = {};
  payload[packetTypeName] = { towerId, x, y };

  const addEnemyTowerPacket = gamePacket.encode(payload).finish();

  return makeNotification(addEnemyTowerPacket, PACKET_TYPES.ADD_ENEMY_TOWER_NOTIFICATION);
};
