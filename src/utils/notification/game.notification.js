import { PACKET_TYPES } from '../../constants/packetTypes.js';
import { PACKET_TYPE_NAMES } from '../../constants/packetTypes.js';
import { getProtoMessages } from '../../init/proto.js';
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

export const updateBaseHpNotification = (isOpponent, baseHp) => {
  const protoMessages = getProtoMessages();
  const packetStructure = protoMessages.GamePacket;
  const packetTypeName = PACKET_TYPE_NAMES[PACKET_TYPES.UPDATE_BASE_HP_NOTIFICATION];

  const updateHpPayload = {};
  updateHpPayload[packetTypeName] = {isOpponent, baseHp};

  const payloadBuffer = packetStructure.encode(updateHpPayload).finish();
  
  return makeNotification(payloadBuffer, PACKET_TYPES.UPDATE_BASE_HP_NOTIFICATION);
};

export const gameOverNotification = (isWin) => {
  const protoMessages = getProtoMessages();
  const packetStructure = protoMessages.GamePacket;
  const packetTypeName = PACKET_TYPE_NAMES[PACKET_TYPES.GAME_OVER_NOTIFICATION];

  const gameOverPayload = {};
  gameOverPayload[packetTypeName] = {isWin};

  const payloadBuffer = packetStructure.encode(gameOverPayload).finish();
  
  return makeNotification(payloadBuffer, PACKET_TYPES.GAME_OVER_NOTIFICATION);
};