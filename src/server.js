import net from 'net';
import { config } from './config/config.js';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { userMonsterData } from './model/model.js';
import { createMonsterData, getAttackedBase, setAttackedBase } from './model/monster.model.js';
import { getTotalAttackedDamage } from './utils/monster.util.js';
import { addUser, getUserById } from './session/user.session.js';
import { getProtoMessages } from './init/proto.js';
import { PACKET_TYPE_NAMES } from './constants/packetTypes.js';
import { createHeader } from './utils/header/createHeader.js';

const server = net.createServer(onConnection);

// addUser('1231sad', 1111);

// const user = getUserById(1111);
// console.log(user);

// let damage = 1;
// const timestamp = Date.now();

// createMonsterData(user.id);

// for (let i = 0; i < 5; i++) {
//   damage += 1;
//   user.attackedBase(damage);
//   setAttackedBase(user.id, damage, user.baseHp, timestamp);
//   console.log(user);
// }

// // 현재까지 몬스터 데미지의 총합 + 지금 받은 데미지
// const previousTotalDamage = getTotalAttackedDamage(user.id);
// let verifyDamage = previousTotalDamage + damage;

// // 유저의 기지 체력을 몬스터 공격력만큼 감소
// user.attackedBase(damage);
// console.log(`${damage}의 피해!`);

// // 유저의 기지가 받은 피해를 기록
// setAttackedBase(user.id, damage, user.baseHp, Date.now());

// // 새로운 피해까지 추가한 총합과 비교
// if (verifyDamage !== getTotalAttackedDamage(user.id)) {
//   console.error(`Invalid damage`);
// }

// console.log(`verifyDamage: ${previousTotalDamage} + ${damage}`);
// console.log(`데미지 총합: ${getTotalAttackedDamage(user.id)}`);
// console.log(`남은 체력: ${user.baseHp}`);

// export const updateBaseHpNotification = (packetType, isOpponent, baseHp) => {
//   // const protoMessages = getProtoMessages();
//   // proto 데이터들 중 GamePacket message를 가져온다.
//   // const responseStructure = protoMessages.GamePacket;
//   const S2CUpdateBaseHPNotification = protoMessages.GamePacket;
//   // GamePacket message의 oneof paylaod 중 packetType에 맞는 특정 message의 이름을 가져온다.
//   const packetTypeName = PACKET_TYPE_NAMES[packetType];

//   // responsePayload : oneof 형태로 encode하기 위해 {Key, Value} Object 구조로 만들어준다.
//   // - Key : 패킷 타입 이름
//   // - Value : 페이로드 데이터
//   const updateHpPayload = {};
//   const update = updateHpPayload[packetTypeName];
//   console.log(update);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행되었습니다.`);
      const protoMessages = getProtoMessages();
      const S2CUpdateBaseHPNotification = protoMessages.GamePacket;
      // console.log(S2CUpdateBaseHPNotification);
      const packetType = 17;
      const packetTypeName = PACKET_TYPE_NAMES[packetType];

      const updateHpPayload = {};
      updateHpPayload[packetTypeName] = { data: null };

      const payloadBuffer = S2CUpdateBaseHPNotification.encode(updateHpPayload).finish();
      const headerBuffer = createHeader(packetType, payloadBuffer, )

      console.log(packetTypeName);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
