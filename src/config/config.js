import { PORT, HOST, CLIENT_VERSION } from '../constants/env.js';
import {
  PACKET_TYPE_LENGTH,
  PAYLOAD_LENGTH,
  SEQUENCE_LENGTH,
  VERSION_LENGTH,
} from '../constants/header.js';
import { DB1_NAME, DB1_USER, DB1_PASSWORD, DB1_HOST, DB1_PORT } from '../constants/env.js';

export const config = {
  //이 config 하나로 모든 환경변수를 가져옴.
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    packetTypeLength: PACKET_TYPE_LENGTH, // Packet Byte : 2
    versionLength: VERSION_LENGTH, // Packet Byte : 1
    sequenceLength: SEQUENCE_LENGTH, // Packet Byte : 4
    payloadLength: PAYLOAD_LENGTH, // Packet Byte : 4
  },
  database: {
    TDO_USER_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
  },
};
