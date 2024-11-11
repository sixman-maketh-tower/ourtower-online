import Game from '../classes/models/game.class.js';
import { gameSessions } from './session.js';

// 새로운 게임을 생성하고 gameSessions에서 추가해주는 함수
export const addGame = (id) => {
  const game = new Game(id);

  gameSessions.push(game);
  return game;
};

export const findWaitingGame = () => {
  const waitingGame = gameSessions.find((game) => game.state === 'waiting');
  return waitingGame;
};

// 게임을 gameSessions에서 삭제하는 함수
export const removeGame = (id) => {
  const gameIndex = gameSessions.findIndex((game) => game.id === id);

  if (gameIndex !== -1) {
    gameSessions[gameIndex].intervalManager.removeMonsterTypeInterval(gameSessions[gameIndex].id);

    return gameSessions.splice(gameIndex, 1)[0];
  }
};

// 게임을 gameSessions에서 id로 찾아 가져오는 함수
export const getGame = (id) => {
  return gameSessions.find((game) => game.id === id);
};

// gameSessions를 가져오는 함수
export const getGameSessions = () => {
  return gameSessions;
};
