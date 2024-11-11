import { config } from '../config/config.js';
import { PACKET_TYPES } from '../constants/packetTypes.js';
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

    const payloadOffset =
      config.packet.typeLength +
      config.packet.versionLength +
      versionLength +
      config.packet.sequenceLength;

    // 패킷의 길이 : Offset [0] 부터 12 바이트
    const payloadLength = socket.buffer.readUInt32BE(payloadOffset);

    const length = payloadLength + totalHeaderLength;

    // 아직 전체 패킷이 수신되지 않았으므로, 다음을 기약한다.
    if (socket.buffer.length < length) {
      break;
    }

    // socket.buffer를 패킷(Payload) 한 개의 길이만큼 잘라준다.
    const packet = socket.buffer.slice(totalHeaderLength, length);
    // socket.buffer에서 꺼낸 패킷의 길이만큼 잘라준다.
    socket.buffer = socket.buffer.slice(length);

    try {
      switch (packetType) {
        case PACKET_TYPES.REGISTER_REQUEST:
          {
            const { payload } = packetParser(packet, packetType);

            console.log(`Packet Type: ${packetType}, Payload: ${payload}`);
          }
          break;
        case PACKET_TYPES.LOGIN_REQUEST:
          {
            const { payload } = packetParser(packet, packetType);

            console.log(`Packet Type: ${packetType}, Payload: ${payload}`);

            //const handler = getHandlerById(packetType);

      await handler({ socket, payload });
    } catch (err) {
      handlerError(socket, err);
    }
  }
};
