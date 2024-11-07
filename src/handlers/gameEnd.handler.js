import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { getGame } from '../session/game.session.js';
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

    // 패자가 요청하는지 승자가 요청하는지는 몰루
    // 게임세션 내 유저 둘의 baseHp를 확인해서 0 이하인 대상에게 isWin을 false
    // 아니면 true를 주는 식으로 해보기

    gameSession.gameOver();
  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default gameEndHandler;
