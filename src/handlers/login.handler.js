import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { SECRETKEY } from '../constants/env.js';
import JWT from 'jsonwebtoken';

const loginHandler = async ({ socket, userId, payload }) => {
  const { id, password } = payload;

  console.log(id, password);

  const token = JWT.sign({
    id: id,
    password: password
  }, SECRETKEY, { expiresIn: "1h" });

  console.log('-----------------------');
  console.log( token );
  
  const verified = JWT.verify(token, SECRETKEY)

  console.log('-----------------------');
  console.log( verified );

  const loginResponse = createResponse(PACKET_TYPES.LOGIN_RESPONSE, {
    success: true,
    message: 'success',
    token: token,
    failCode: 0,
  });

  socket.write(loginResponse);
};

export default loginHandler;