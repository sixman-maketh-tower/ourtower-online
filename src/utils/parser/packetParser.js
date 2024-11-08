import { getProtoPayloadTypeById, getProtoTypeById } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/proto.js';
import { CustomError } from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data, packetType) => {
  const protoMessages = getProtoMessages();

  const protoTypeName = getProtoTypeById(packetType);
  // protoTypeName 검증
  if (!protoTypeName) {
    throw new CustomError(
      ErrorCodes.UNKNOWN_HANDLER_ID,
      `[${handlerId}] HandlerId의 프로토타입을 찾을 수 없습니다. : ${err.message}`,
    );
  }

  // load한 protoMesages 들 중 protoTypeName에 맞는 message 틀을 가져온다.
  const payloadTypeStructure = protoMessages[protoTypeName];

  // message 틀의 oneof payload를 payloadType에 해당하는 message을 가져온다.
  const payloadTypeName = getProtoPayloadTypeById(packetType);

  let payload;

  // packetType에 해당하는 message구조로 data를 Decode 해준다.
  try {
    payload = payloadTypeStructure.decode(data)[payloadTypeName];
  } catch (err) {
    throw new CustomError(
      ErrorCodes.PACKET_DECODE_ERROR,
      `페이로드 디코딩 중 오류가 발생했습니다. : ${err.message}`,
    );
  }

  // verify 과정은 이미 위의 decode 함수 내부에서 자체적으로 수행되지만, 우선 구현은 해놓는다.
  const errorMessage = payloadTypeStructure.verify(payload);
  if (errorMessage) {
    throw new CustomError(
      ErrorCodes.PACKET_STRUCTURE_MISMATCH,
      `페이로드 구조가 타입과 일치하지 않습니다. : ${err.message}`,
    );
  }

  //console.log(payload);

  return { payload };
};
