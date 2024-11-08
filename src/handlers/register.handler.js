import { PACKET_TYPES } from '../constants/packetTypes.js';
import { createResponse } from '../utils/response/createResponse.js';
import { findUserByAccountId, createUser } from '../db/user/user.db.js';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const registerHandler = async ({ socket, userId, payload }) => {
  const { id, password, email } = payload;
  console.log(id, password, email);

  const testUserInfo = {
    id: id,
    password: password,
    email: email,
  }

  const joinSchema = Joi.object({
    id: Joi.string().alphanum().lowercase().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  });

  const validateResult = joinSchema.validate(testUserInfo);

  if (validateResult.error) {
    const registerFailResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
      success: false,
      message: 'Failed',
      failCode: 2,
    });
    console.log('fail: wrong value');
    socket.write(registerFailResponse);
    return;
  } else {
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
      return;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const regiUser = await createUser(id, hashedPassword, email);
      console.log(regiUser);
      const registerResponse = createResponse(PACKET_TYPES.REGISTER_RESPONSE, {
        success: true,
        message: 'Success',
        failCode: 0,
      });

      socket.write(registerResponse);
    };
  };
  // 가능한 경우
  // 2. id, password, email을 user 테이블에 저장한다.(create)
};

export default registerHandler;
