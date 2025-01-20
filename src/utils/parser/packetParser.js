import { config } from "../../config/config.js";
import { getpacketnameByHandlerId, getProtoTypeNameByHandlerId } from "../../handlers/index.js";
import { getProtoMessages } from "../../init/loadProtos.js";

export const packetParser = (packetType, version, sequence, packetpayload) => {
    
    if (version!== config.client.version) {
        console.error(
          '클라이언트 버전이 일치하지 않습니다.',
        );
      }

const protoMessages = getProtoMessages();

const GamePacket = protoMessages["packets"]["GamePacket"];

const packetname = getpacketnameByHandlerId(packetType);
const protoTypeName = getProtoTypeNameByHandlerId(packetType);

if (!protoTypeName) {
    console.error(`알 수 없는 핸들러 ID: ${packetType}`);
  }
  
  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  
  
  let payload;
  try {
    payload = GamePacket.decode(packetpayload);
    payload = payload[packetname];
  }catch (error) {
    console.error( '패킷 구조가 일치하지 않습니다.');
  }
 
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) {
    console.error(
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

    return { packetType, sequence, payload};
}