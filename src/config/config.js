import { CLIENT_VERSION, HOST, PORT } from '../constants/env.js';
import {
  PACKET_TYPE_LENGTH,
  PAYLOAD_LENGTH,
  VERSION_LENGTH,
  SEQUENCE_LENGTH,
} from '../constants/packetTypes.js';
import {
  GAME_STATE_PLAYING,
  GAME_STATE_WAITING,
  INIT_BASE_DATA,
  INIT_GOLD,
  INIT_MONSTER_SPAWN_INTERVAL,
  INIT_TOWER_COST,
  MAX_MONSTER_LEVEL,
  MAX_PLAYER,
} from '../constants/game.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    clientVersion: CLIENT_VERSION,
  },
  packet: {
    typeLength: PACKET_TYPE_LENGTH,
    versionLength: VERSION_LENGTH,
    sequenceLength: SEQUENCE_LENGTH,
    payloadLength: PAYLOAD_LENGTH,
  },
  game: {
    maxPlayer: MAX_PLAYER,
    state: {
      waiting: GAME_STATE_WAITING,
      playing: GAME_STATE_PLAYING,
    },
    initData: {
      baseHp: INIT_BASE_DATA.maxHp,
      towerCost: INIT_TOWER_COST,
      gold: INIT_GOLD,
      monsterSpawnInterval: INIT_MONSTER_SPAWN_INTERVAL,
    },
    baseData: INIT_BASE_DATA,
    maxMonsterLevel: MAX_MONSTER_LEVEL,
  },
  database: {
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
  },
};
