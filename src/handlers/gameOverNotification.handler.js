import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { getGame } from '../session/game.session.js';
import { getUserById } from '../session/user.session.js';

const gameOverNotificationHandler = async ({ socket, userId, payload }) => {
  try {
    const { gameId, damage } = payload;
    const gameSession = getGame(gameId);

    if (!gameSession) {
      console.error('Game not found');
    }

    const user = getUserById(userId);

    if (!user) {
      console.error('User not found');
    }

    let userAttackedBase = getAttackedBase(userId);

    if (!userAttackedBase) {
      createMonsterData(userId);
      userAttackedBase = getAttackedBase(userId);
      if(!userAttackedBase) {
        console.error(`User's Monster Session not found`);
      }
    }

    const monsterAttackBaseResponse = createResponse(PACKET_TYPES.MONSTER_ATTACK_BASE_REQUEST, {
      success: 0,
      message: 'success',
      failCode: 0,
    });

    socket.write(monsterAttackBaseResponse);
  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default gameOverNotificationHandler;
