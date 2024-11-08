import { PACKET_TYPE_NAMES, PACKET_TYPES } from '../../constants/packetTypes.js';
import { getProtoMessages } from '../../init/proto.js';
import { createHeader } from '../header/createHeader.js';

export const createResponse = (packetType, data = null) => {
  const protoMessages = getProtoMessages();

  // proto 데이터들 중 GamePacket message를 가져온다.
  const responseStructure = protoMessages.GamePacket;

  // GamePacket message의 oneof paylaod 중 packetType에 맞는 특정 message의 이름을 가져온다.
  const packetTypeName = PACKET_TYPE_NAMES[packetType];

  // responsePayload : oneof 형태로 encode하기 위해 {Key, Value} Object 구조로 만들어준다.
  // - Key : 패킷 타입 이름
  // - Value : 페이로드 데이터
  const responsePayload = {};
  responsePayload[packetTypeName] = data;

  // responseStructure(GamePacket message) 틀에 responsePayload 데이터를 encode 해준다.
  const payloadBuffer = responseStructure.encode(responsePayload).finish();

  const headerBuffer = createHeader(packetType, payloadBuffer, 1);

  return Buffer.concat([headerBuffer, payloadBuffer]);
};
