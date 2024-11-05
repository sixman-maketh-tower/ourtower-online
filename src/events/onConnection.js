import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(`새로운 클라이언트가 연결되었습니다: ${socket.remoteAddress}:${socket.remotePort}`);

  // 클라이언트의 socket마다 고유한 Buffer를 만들어주어 관리한다.
  socket.buffer = Buffer.alloc(0);

  // 소켓 데이터 수신 이벤트
  socket.on('data', onData(socket));

  // 소켓 연결 종료 이벤트
  socket.on('end', onEnd(socket));

  // 소켓 에러 이벤트
  socket.on('error', onError(socket));
};
