import { config } from '../../config/config.js';

/* 패킷 명세서
packetType (ushort)     : 패킷 타입 (2바이트)
versionLength (ubyte)   : 버전 길이 (1바이트)
version (string)        : 버전 (문자열)
sequence (uint32)       : 패킷 번호 (4바이트)
payloadLength (uint32)  : 데이터 길이 (4바이트)
payload (bytes)         : 실제 데이터
*/

export const createHeader = (packetType, payload, sequence) => {
  // 헤더 정보들을 미리 세팅해놓는다.
  const version = config.client.clientVersion;
  const versionLength = version.length;
  const payloadLength = Buffer.byteLength(payload);

  // 1. packetType (2 Byte) : 패킷의 타입을 담고 있다.
  const packetTypeBuffer = Buffer.alloc(config.packet.typeLength);
  packetTypeBuffer.writeUInt16BE(packetType);

  // 2. versionLength (1 Byte) : version 문자열의 길이를 담고 있다.
  const versionLengthBuffer = Buffer.alloc(config.packet.versionLength);
  versionLengthBuffer.writeUint8(versionLength);

  // 3. version (N Byte) : version 문자열을 담고 있다.
  const versionBuffer = Buffer.alloc(versionLength);
  versionBuffer.write(version);

  // 4. sequence (4 Byte) : 패킷의 순서를 담고 있다.
  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeUInt32BE(sequence);

  // 5. payloadLength (4 Byte) : 페이로드(GamePacket)의 길이를 담고 있다.
  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLength);
  payloadLengthBuffer.writeUint32BE(payloadLength);

  return Buffer.concat([
    packetTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
  ]);
};
