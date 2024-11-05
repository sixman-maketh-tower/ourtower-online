import { HANDLER_IDS } from '../constants/handlerIds.js';
import { CustomError } from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';

const handlers = {
  [HANDLER_IDS.LOGIN]: {
    protoType: 'game.C2SLoginRequest',
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
