import { config } from '../../config/config.js';

export const GameState = (user, path, highScore) => {
  const player = user;
  const pathData = path;
  const playerHighScore = highScore;

  const playerData = {
    gold: player.gold,
    base: config.game.baseData,
    highScore: playerHighScore,
    towers: player.towers,
    monsters: [],
    monsterLevel: 1,
    score: player.score,
    monsterPath: pathData,
    basePosition: pathData[pathData.length - 1],
  };

  return playerData;
};

export const initialState = () => {
  const initialGameState = {
    baseHp: config.game.initData.baseHp,
    towerCost: config.game.initData.towerCost,
    initialGold: config.game.initData.gold,
    monsterSpawnInterval: config.game.initData.monsterSpawnInterval,
  };
  return initialGameState;
};
