import { PACKET_TYPES } from "../constants/packetTypes.js";
import { getServerGameAssets } from "../init/assets.js";
import { getGameSessions } from "../session/game.session.js";
import { createResponse } from "../utils/response/createResponse.js";

let towerId = 0;

const towerPurchaseHandler = async ({ socket, userId, payload }) => {
    // 유저가 접속한 게임세션 찾기
    // 게임에 속한 유저 데이터 중 towers 배열에 구매요청한 타워 추가
    // 타워구매 응답패킷 만들어 클라이언트에 반환
    
    const { x, y } = payload;
    const { towerData } = getServerGameAssets();

    const gameSession = getGameSessions();
    if (!gameSession) {
        console.error('게임 세션이 존재하지 않습니다.')
    }
    const user = gameSession.getUser(userId)
    if (!user) {
        console.error('해당 유저가 속한 게임세션이 존재하지 않습니다.')
    }

    user.bindTower(x, y, userId, towerId)

    towerId += 1;
    console.log('towerId?: ', towerId)
    const towerPurchaseResponse = createResponse(PACKET_TYPES.TOWER_PURCHASE_RESPONSE, {
        towerId: towerId
    })

    socket.write(towerPurchaseResponse);
}

export default towerPurchaseHandler;