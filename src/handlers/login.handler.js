import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { SECRETKEY } from '../constants/env.js';
import { findUserByAccountId, updateUserLogin } from '../db/user/user.db.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { addUser } from '../session/user.session.js';

const loginHandler = async ({ socket, userId, payload }) => {
  const { id, password } = payload;
  console.log(id, password);
  // 1. db에서 id를 가진 유저를 찾는다.
  const loginUser = await findUserByAccountId(id);
  // 1-1. 만약 없다면 로그인 실패 response 보낸다.
  if (!loginUser) {
    const loginFailResponse = createResponse(PACKET_TYPES.LOGIN_RESPONSE, {
      success: false,
      message: 'Fail: Not exist Id',
      token: '',
      failCode: 2,
    });
    console.log('Fail: Not exist Id');
    socket.write(loginFailResponse);
  } else {
    // 1-2. 있다면 먼저 비밀번호 검증
    if (password !== loginUser['password']) {
      const loginFailResponse = createResponse(PACKET_TYPES.LOGIN_RESPONSE, {
        success: false,
        message: 'Fail: Dismatch password',
        token: '',
        failCode: 2,
      });
      console.log('Fail: Dismatch password');
      socket.write(loginFailResponse);
    } else {
      // 1-3. 이제 진짜 로그인 성공
      // token을 만든다 ({id, password}), lastLogin 값을 업데이트해주고, login success response를 클라이언트에게 보내준다.
      const loginUserId = loginUser['id'];
      const loginUserAccountId = loginUser['accountId'];
      console.log(loginUserId + ' / ' + loginUserAccountId);
      await updateUserLogin(loginUserAccountId);

      const token = JWT.sign(
        {
          id: loginUserId,
        },
        SECRETKEY,
        { expiresIn: '1h' },
      );

      console.log('-----------------------');
      console.log(token);

      const verified = JWT.verify(token, SECRETKEY);

      console.log('-----------------------');
      console.log(verified);

      addUser(socket, loginUserId);

      const loginResponse = createResponse(PACKET_TYPES.LOGIN_RESPONSE, {
        success: true,
        message: 'Success',
        token: token,
        failCode: 0,
      });

      socket.write(loginResponse);
    }
  }
};

export default loginHandler;
