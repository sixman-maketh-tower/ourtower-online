import { v4 as uuidv4 } from 'uuid';
import { findWaitingGame, getGameSessions, addGame } from '../../session/game.session.js';
import { handlerError } from '../../utils/error/errorHandler.js';
import { getUserBySocket } from '../../session/user.session.js';
import { CustomError } from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import {
  clearUserMonsterData,
  getUserMonsterData,
} from '../../models/monster.model.js';

const matchingGameHandler = ({ socket, payload }) => {
  try {
    // 1. findWaitGame() 으로 비어있는 게임을 찾는다.
    const gameSession = getGameSessions();

    let waitingGame = findWaitingGame();

    const user = getUserBySocket(socket);

    // 1-1. 모든 게임이 플레이 중이거나, 게임 세션배열이 비어있는 경우
    // addGame() Game 인스턴스를 하나 생성해준다.
    if (!waitingGame || gameSession.length === 0) {
      const gameId = uuidv4();
      waitingGame = addGame(gameId); // id 값은 어디에서 오는가
    }

    // 이제 비어 있는 게임은 무조건 있는 상태
    // 2. 비어 있는 게임에 해당 유저를 참가시킨다.
    waitingGame.addUser(user);

  } catch (error) {
    handlerError(socket, error);
  }
};

export default matchingGameHandler;
