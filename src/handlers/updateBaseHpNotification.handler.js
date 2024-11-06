import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { getGame } from '../session/game.session.js';
import { getUserById } from '../session/user.session.js';

const updateBaseHpNotificationHandler = async ({ socket, userId, payload }) => {
  try {
    const { gameId, isOpponent, baseHp } = payload;
    const gameSession = getGame(gameId);

    if (!gameSession) {
      console.error('Game not found');
    }

    const user = getUserById(userId);

    if (!user) {
      console.error('User not found');
    }

    user.updateBaseHp(baseHp);
    const updatePacket = gameSession.getAllBaseHp();
    // const updateBaseHpPacket = createResponse(PACKET_TYPES.UPDATE_BASE_HP_NOTIFICATION, {
    //   isOppnent: true,
    //   baseHp: baseHp,
    // });

    socket.write(updatePacket);
  } catch (e) {
    console.error('updateBaseHpNotification Error: ', e);
  }
};

export default updateBaseHpNotificationHandler;
