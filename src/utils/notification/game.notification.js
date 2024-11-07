import { PACKET_TYPES } from '../../constants/packetTypes.js';
import { PACKET_TYPE_NAMES } from '../../constants/packetTypes.js';
import { createHeader } from '../header/createHeader.js';

export const makeNotofication = (message, type) => {
  const packetLength = Buffer.alloc(config.packet.totalLength);
  packetLength.writeUInt32BE(message.length + config.packet.totalLength + config.packet.typeLength);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(type, 0);

  return Buffer.concat([packetLength, packetType, message]);
};

export const updateBaseHpNotification = (packetType, isOpponent, baseHp) => {
  const protoMessages = getProtoMessages();
  // proto 데이터들 중 GamePacket message를 가져온다.
  // const responseStructure = protoMessages.GamePacket;
  const packetStructure = protoMessages.GamePacket;
  // GamePacket message의 oneof paylaod 중 packetType에 맞는 특정 message의 이름을 가져온다.
  const packetTypeName = PACKET_TYPE_NAMES[packetType];

  // responsePayload : oneof 형태로 encode하기 위해 {Key, Value} Object 구조로 만들어준다.
  // - Key : 패킷 타입 이름
  // - Value : 페이로드 데이터
  const updateHpPayload = {};
  updateHpPayload[packetTypeName] = {isOpponent, baseHp};
  console.log(updateHpPayload);

  // const payload = { isOpponent, baseHp };
  // const message = update.create(payload);
  // const updateHpPacket = update.encode(message).finish();

  const payloadBuffer = packetStructure.encode(updateHpPayload).finish();
  const headerBuffer = createHeader(packetType, payloadBuffer, 1);
  // return makeNotification(updateHpPacket, PACKET_TYPES.UPDATE_BASE_HP_NOTIFICATION);
  return Buffer.concat([headerBuffer, payloadBuffer]);
};
