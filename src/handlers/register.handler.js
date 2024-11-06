import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';

const registerHandler = async ({ socket, userId, payload }) => {
  const { id, password, email } = payload;

  console.log(id, password, email);

  const registerResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
    success: true,
    message: 'Success',
    failCode: 0,
  });

  socket.write(registerResponse);
};

export default registerHandler;
