import { CustomError } from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { handlerError } from '../utils/error/errorHandler.js';

export const onError = (socket) => (err) => {
  handlerError(socket, new CustomError(ErrorCodes.SOCKET_ERROR, `소켓 오류: ${err.message}`));
};
