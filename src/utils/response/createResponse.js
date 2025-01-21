import { config } from '../../config/config.js';
import { getpacketnameByHandlerId } from '../../handlers/index.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const createResponse = (packetType, payloadData = {}, sequence) => {
  //console.log("\npacketType:",packetType,"\npayloadData:",payloadData);
  // 패킷 타입 정보를 넣은 버퍼 생성
  const typeBuffer = Buffer.alloc(config.packet.packetTypeLength);
  typeBuffer.writeUInt16BE(packetType);
  // 버전 길이 정보를 담은 버퍼 생성 이건 왜하는건지 모르겠다.그리고 이거 하는데 sequence 이놈은 왜??
  const versionLengthBuffer = Buffer.alloc(config.packet.versionLength);
  versionLengthBuffer.writeUInt8(config.client.version.length);
  // 버전 문자 정보 ..
  const versionString = config.client.version;
  const versionBuffer = Buffer.from(versionString, 'utf-8');
  // 이새낀 왜?? 길이 없음?
  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeUInt32BE(sequence);

  //이제 페이로드. 먼저 패이로드 만들고, 길이는 나중에.
  const protoMessages = getProtoMessages();
  //이거 더 좋은 방법 있을거 같은데.. 모르겠다.. 돼니까 좋았어.
  const packetname = getpacketnameByHandlerId(packetType);

  const gamePacket = protoMessages['packets']['GamePacket'];
  const responsePayload = {};
  // if (packetType === 10){
  //   console.log("payloadData:", payloadData);
  // };
  responsePayload[packetname] = payloadData;
  const payloadBuffer = gamePacket.encode(responsePayload).finish();

  // if (packetType === 10){
  //   console.log("payloadBuffer:", payloadBuffer);
  // };

  // 6. 페이로드 길이 만들기.
  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLength);
  payloadLengthBuffer.writeUInt32BE(payloadBuffer.length);

  return Buffer.concat([
    typeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
    payloadBuffer,
  ]);
};
