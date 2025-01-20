import { PORT, HOST, CLIENT_VERSION} from '../constants/env.js';
import { PACKET_TYPE_LENGTH, PAYLOAD_LENGTH, SEQUENCE_LENGTH, VERSION_LENGTH } from '../constants/header.js';

export const config = { //이 config 하나로 모든 환경변수를 가져옴.
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    packetTypeLength: PACKET_TYPE_LENGTH, //2
    versionLength: VERSION_LENGTH,  //1
    sequenceLength: SEQUENCE_LENGTH, //4
    payloadLength: PAYLOAD_LENGTH, //4
  },
};