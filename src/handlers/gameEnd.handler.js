import { getGameSessions } from '../session/game.session.js';
import { getUserById } from '../session/user.session.js';

const gameEndHandler = async ({ socket, userId, payload }) => {
  try {
    const user = getUserById(userId);

    if (!user) {
      console.error('User not found');
    }

    // 유저가 들어있는 게임 세션을 찾아야함
    const gameSessions = getGameSessions();
    const gameSession = gameSessions.find((session) => session.users.includes(userId));

    if (!gameSession) {
      console.error('Game not found');
    }

    await gameSession.gameOver();
  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default gameEndHandler;
