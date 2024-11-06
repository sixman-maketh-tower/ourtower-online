import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';

const loginHandler = async ({ socket, userId, payload }) => {
  const { id, password } = payload;

  console.log(id, password);

  const loginResponse = createResponse(PACKET_TYPES.LOGIN_RESPONSE, {
    success: 0,
    message: 'Success',
    token: 'token',
    failCode: 0,
  });

  socket.write(loginResponse);
};

export default loginHandler;
