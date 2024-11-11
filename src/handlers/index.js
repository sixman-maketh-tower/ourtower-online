import { HANDLER_IDS } from '../constants/handlerIds.js';
import { CustomError } from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import loginHandler from './auth/login.handler.js';
import monsterAttackBaseHandler from './game/monsterAttackBase.handler.js';
import gameEndHandler from './game/gameEnd.handler.js';
import registerHandler from './auth/register.handler.js';
import { towerPurchaseHandler, towerAttackHandler } from './game/tower.handler.js';
import matchingGameHandler from './game/matchingGame.handler.js';
import spawnMonsterHandler from './game/spawnMonster.handler.js';
import deathMonsterHandler from './game/monsterDeath.handler.js';

const handlers = {
  [HANDLER_IDS.REGISTER]: {
    protoType: 'GamePacket',
  },
  [HANDLER_IDS.LOGIN]: {
    protoType: 'GamePacket',
  },
};

export const getHandlerById = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] HandlerID의 핸들러를 찾을 수 없습니다: `,
    );
  }

  return handlers[packetType].handler;
};

export const getProtoTypeById = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] HandlerID의 프로토타입을 찾을 수 없습니다: `,
    );
  }

  return handlers[packetType].protoType;
};
