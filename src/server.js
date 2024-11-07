import net from 'net';
import { config } from './config/config.js';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행되었습니다.`);
      const protoMessages = getProtoMessages();
      const S2CUpdateBaseHPNotification = protoMessages.GamePacket;
      // console.log(S2CUpdateBaseHPNotification);
      const packetType = 17;
      const packetTypeName = PACKET_TYPE_NAMES[packetType];

      const updateHpPayload = {};
      updateHpPayload[packetTypeName] = { data: null };

      const payloadBuffer = S2CUpdateBaseHPNotification.encode(updateHpPayload).finish();
      const headerBuffer = createHeader(packetType, payloadBuffer, )

      console.log(packetTypeName);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
