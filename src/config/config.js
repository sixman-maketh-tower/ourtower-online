import { CLIENT_VERSION, HOST, PORT } from '../constants/env.js';
import {
  PACKET_TYPE_LENGTH,
  PAYLOAD_LENGTH,
  VERSION_LENGTH,
  SEQUENCE_LENGTH,
  MAX_PLAYER,
} from '../constants/packetTypes.js';

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
      waiting: 'waiting',
      playing: 'inProgress',
    },
  },
};
