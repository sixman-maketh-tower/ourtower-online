import { HANDLER_IDS } from '../constants/handlerIds.js';
import { PACKET_TYPE_NAMES } from '../constants/packetTypes.js';
import { CustomError } from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import loginHandler from './login.handler.js';
import monsterAttackBaseHandler from './monsterAttackBase.handler.js';
import gameEndHandler from './gameEnd.handler.js';
import registerHandler from './register.handler.js';
import towerPurchaseHandler from './tower.handler.js';
import matchingGameHandler from './game/matchingGameHandler.js';
import spawnMonsterHandler from './spawnMonster.handler.js';
import spawnMonsterHandler from './spawnMonster.handler.js';

const handlers = {
  [HANDLER_IDS.REGISTER]: {
    handler: registerHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.REGISTER],
  },
  [HANDLER_IDS.LOGIN]: {
    handler: loginHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.LOGIN],
  },
  [HANDLER_IDS.MATCH_REQUEST]: {
    handler: matchingGameHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.MATCH_REQUEST],
  },
  [HANDLER_IDS.TOWER_PURCHASE]: {
    handler: towerPurchaseHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.TOWER_PURCHASE],
  },
  [HANDLER_IDS.SPAWN_MONSTER]: {
    handler: spawnMonsterHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.SPAWN_MONSTER],
  },
  [HANDLER_IDS.MONSTER_ATTACK_BASE]: {
    handler: monsterAttackBaseHandler,
    protoType: 'GamePacket',
    protoPayloadType: PACKET_TYPE_NAMES[HANDLER_IDS.MONSTER_ATTACK_BASE],
  },
  [HANDLER_IDS.GAME_END]: {
    handler: gameEndHandler,
    protoType: 'GamePacket',
    protoPaylaodType: PACKET_TYPE_NAMES[HANDLER_IDS.GAME_END],
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

export const getProtoPayloadTypeById = (packetType) => {
  if (!handlers[packetType]) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${packetType}] HandlerID의 프로토타입을 찾을 수 없습니다: `,
    );
  }

  return handlers[packetType].protoPayloadType;
};
