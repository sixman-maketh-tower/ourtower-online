import { getGameSessions, removeGame } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';

const gameEndHandler = async ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);

    if (!user) {
      console.error('User not found');
    }

    const gameSessions = getGameSessions();
    const gameSession = gameSessions.find((session) => session.users.includes(user));

    if (!gameSession)
      return;

    if (!gameSession.users.find((findUser) => findUser.winLose === false)) {
      if (user.baseHp <= 0) {
        user.winLose = false;
        gameSession.gameOver();
      }
    }

    const opponentUser = gameSession.users.find((findUser) => findUser.id !== user.id);

    // 유저의 점수가 db에서 가진 최고점수를 넘겼다면 갱신
    await gameSession.updateScore(user, opponentUser);

    // 게임 데이터 정보 초기화 후 게임 세션 정리
    gameSession.init();
    removeGame(gameSession.id);

  } catch (e) {
    console.error('gameOverHandler Error: ', e);
  }
};

export default gameEndHandler;
