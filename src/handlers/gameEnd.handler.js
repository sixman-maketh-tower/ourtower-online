import { config } from '../config/config.js';
import { INIT_BASE_DATA, INIT_BASE_HP } from '../constants/game.js';
import { findHighScoreByUserId } from '../db/user/user.db.js';
import { clearUserMosnterData } from '../models/monster.model.js';
import { getGameSessions, removeGame } from '../session/game.session.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';

const gameEndHandler = async ({ socket, userId, payload }) => {
  try {
    const user = getUserBySocket(socket);

    if (!user) {
      console.error('User not found');
    }

    // 유저가 들어있는 게임 세션을 찾아야함
    const gameSessions = getGameSessions();
    const gameSession = gameSessions.find((session) => session.users.includes(user));

    if (!gameSession) {
      console.error('Game not found');
    }

    user.gold = config.game.initData.gold;
    user.baseHp = config.game.initData.baseHp;
    user.score = 0;
    user.state = config.game.state.waiting;
    clearUserMosnterData(user.id);
    //타워 정보 비우기
    removeGame(gameSession.id);
  } catch (e) {
    console.error('monsterAttackBaseHandler Error: ', e);
  }
};

export default gameEndHandler;


// public void OnGameEnd()
// {
//     isGameStart = false;
//     monsters.ForEach(obj => obj.StopMonster());
//     towers.ForEach(obj => obj.StopTower());
//     monsters.Clear();
//     towers.Clear();
//     StopAllCoroutines();
//     StartCoroutine(OnSceneChange());
// }