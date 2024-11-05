import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';

const registerHandler = async ({ socket, userId, payload }) => {
  const { id, password, email } = payload;

  const registerResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
    success: 0,
    message: 'Suc',
    failCode: 0,
  });

  console.log(registerResponse);

  socket.write(registerResponse);
};

export default registerHandler;
