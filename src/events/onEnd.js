import { getGame, getGameSessions, removeGame } from "../session/game.session.js";
import { getUserBySocket } from "../session/user.session.js";
import { gameOverNotification } from "../utils/notification/game.notification.js";

export const onEnd = (socket) => async () => {
  console.log(`클라이언트 연결이 종료되었습니다.`);

  const user = getUserBySocket(socket);
  const gameSession = getGameSessions().find((session) => session.users.includes(user));
  if(gameSession) {
    console.log('클라이언트 종료가 발견되어 상대방 유저가 승리합니다.');
    
    // 상대를 승리시키고 게임오버 패킷 전달
    const opponent = gameSession.getOpponentUser(user.id);
    opponent.winLose = true;

    const packet = gameOverNotification(opponent.winLose);
    
    await gameSession.updateScore(user, opponent);

    opponent.socket.write(packet);

    removeGame(gameSession.id);
    gameSession.init();
  }
};
