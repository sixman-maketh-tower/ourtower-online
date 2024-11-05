import { config } from '../../config/config.js';
import { PACKET_TYPE_NAMES, PACKET_TYPES } from '../../constants/packetTypes.js';
import { getProtoMessages } from '../../init/proto.js';

export const createResponse = (packetType, data = null) => {
  const protoMessages = getProtoMessages();

  const packetTypeName = PACKET_TYPE_NAMES[packetType];

  const responseStructure = protoMessages.GamePacket;

  const responsePayload = {};
  responsePayload[packetTypeName] = data;

  const buffer = responseStructure.encode(responsePayload).finish();

  console.log(buffer);

  const version = config.client.clientVersion;
  const versionLength = version.length;
  const sequence = 1;
  const payloadLength = Buffer.byteLength(buffer);

  const packetTypeBuffer = Buffer.alloc(config.packet.typeLength);
  packetTypeBuffer.writeUInt16BE(packetType);

  const versionLengthBuffer = Buffer.alloc(config.packet.versionLength);
  versionLengthBuffer.writeUint8(versionLength);

  const versionBuffer = Buffer.alloc(versionLength);
  versionBuffer.write(version);

  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeUInt32BE(sequence);

  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLength);
  payloadLengthBuffer.writeUint32BE(payloadLength);

  return Buffer.concat([
    packetTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
    buffer,
  ]);
};
