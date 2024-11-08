import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { findUserByAccountId, createUser, createHighScore } from '../db/user/user.db.js';

const registerHandler = async ({ socket, userId, payload }) => {
  const { id, password, email } = payload;

  console.log(id, password, email);

  if (!id && !password && !email) {
    const registerFailResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
      success: false,
      message: 'Failed',
      failCode: 2,
    });
    console.log('fail: empty value');
    socket.write(registerFailResponse);
  };
  // 1. user 테이블에 해당 id(accountId)가 있는지 검사한다.
  const user = await findUserByAccountId(id);
  console.log(JSON.stringify(user))
  // 1-1. 만약 똑같은 id가 있다면 response 실패를 보낸다.
  if (user) {
  const registerFailResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
    success: false,
    message: 'Failed',
    failCode: 2,
  });
  console.log('fail: ' + JSON.stringify(user) + '/' + user['id']);
  socket.write(registerFailResponse);
  } else {
    const regiUser = await createUser(id, password, email);
    const dbUser = await findUserByAccountId(id);
    await createHighScore(dbUser.id, 0);
    console.log(regiUser);
    console.log(await findUserByAccountId(id));
    const registerResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
      success: true,
      message: 'Success',
      failCode: 0,
    });
  
    socket.write(registerResponse);
  };
  // 가능한 경우
  // 2. id, password, email을 user 테이블에 저장한다.(create)
};

export default registerHandler;
