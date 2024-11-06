import { v4 as uuidv4 } from 'uuid';
import { findWaitingGame, getGameSessions, addGame } from '../../session/game.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { getUserById } from '../../session/user.session.js';
import { CustomError } from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';

const matchingGameHandler = ({ socket, userId, payload }) => {
  try {
    // 1. findWaitGame() 으로 비어있는 게임을 찾는다.
    const gameSession = getGameSessions();
    let waitingGame = findWaitingGame();
    const gameId = uuidv4();
    const user = getUserById(userId);
    console.log(`유저ID: `, userId);

    // 1-1. 모든 게임이 플레이 중이거나, 게임 세션배열이 비어있는 경우
    // addGame() Game 인스턴스를 하나 생성해준다.
    if (!waitingGame || gameSession.length === 0) {
      waitingGame = addGame(gameId); // id 값은 어디에서 오는가
    }

    // 이제 비어 있는 게임은 무조건 있는 상태
    // 2. 비어 있는 게임에 해당 유저를 참가시킨다.
    waitingGame.addUser(user);
    //

    // 끝...

    // const { gameId } = payload;

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    // const existUser = gameSession.getUser(user.id);
    // if (!existUser) {
    //   gameSession.addUser(user);
    // }

    // const joinGameResponse = createResponse(
    //   PACKET_TYPES.MATCH_START_NOTIFICATION,
    //   RESPONSE_SUCCESS_CODE,
    //   { gameId, message: '게임에 참가했습니다.' },
    //   user.id,
    // );
    // socket.write(joinGameResponse);
  } catch (error) {
    handlerError(socket, error);
  }
};

export default matchingGameHandler;
