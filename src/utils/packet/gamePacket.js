import { config } from '../../config/config.js';

export const GameState = (user, path) => {
  const player = user;
  const pathData = path;

  const playerData = {
    gold: player.gold,
    base: config.game.baseData,
    highScore: 0,
    towers: player.towers,
    monsters: [],
    monsterLevel: 0,
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
