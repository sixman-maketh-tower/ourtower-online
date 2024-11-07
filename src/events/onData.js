import { config } from '../config/config.js';
import { getHandlerById } from '../handlers/index.js';
import { handlerError } from '../utils/error/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  // 수신한 데이터를 socket의 buffer에 추가해준다.
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const versionLength = socket.buffer.readUInt8(config.packet.typeLength);

  const totalHeaderLength =
    config.packet.typeLength +
    config.packet.versionLength +
    versionLength +
    config.packet.sequenceLength +
    config.packet.payloadLength;

  // 수신한 데이터들을 패킷 단위로 마샬링(Marshalling)해준다.
  while (socket.buffer.length >= totalHeaderLength) {
    // 패킷의 타입 : Offset [0] 부터 2 바이트
    const packetType = socket.buffer.readUInt16BE(0);

    const payloadLengthOffset =
      config.packet.typeLength +
      config.packet.versionLength +
      versionLength +
      config.packet.sequenceLength;

    // 페이로드의 길이 : Offset [payloadOffset] 부터 4 바이트
    const payloadLength = socket.buffer.readUInt32BE(payloadLengthOffset);

    // 패킷의 길이 : Header + payload
    const packetLength = totalHeaderLength + payloadLength;

    // 아직 패킷의 페이로드가 도착하지 않았으므로, 다음을 기약한다.
    if (socket.buffer.length < packetLength) {
      break;
    }

    // socket.buffer에서 현재 패킷의 페이로드를 slice해준다.
    const packet = socket.buffer.slice(totalHeaderLength, packetLength);

    // socket.buffer에서 꺼낸 패킷의 길이만큼 잘라준다.
    socket.buffer = socket.buffer.slice(packetLength);

    try {
      // packet을 packetType의 message 형태로 Parsing한다.
      const { payload } = packetParser(packet, packetType);

      console.log(`Packet Type: ${packetType}, Payload: ${payload}`);

      // packetType에 맞는 핸들러를 얻어온다.
      const handler = getHandlerById(packetType);

      await handler({ socket, userId: 4, payload });
    } catch (err) {
      handlerError(socket, err);
    }
  }
};
