import { getProtoMessages } from '../../init/proto.js';
import { PACKET_TYPES } from '../../constants/packetTypes.js';

const makeNotification = (message, type) => {
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(message.length + config.packet.totalLength + config.packet.typeLength);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

export const gameStartNotification = (gameId, timestamp) => {
  const protoMessages = getProtoMessages();
  const Start = protoMessages.GamePacket.matchStartNotification;

  const payload = { gameId, timestamp };
  const message = Start.create(payload);
  const startPacket = Start.encode(message).finish();
  return makeNotification(startPacket, PACKET_TYPES.MATCH_START_NOTIFICATION);
};
