import { config } from '../config/config.js';
import { getHandlerById } from '../handlers/index.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  // 데이터가 계속 오니까 여기에 쌓는거.
  socket.buffer = Buffer.concat([socket.buffer, data]);

  //버전 길이가 달라지면 여기로 와서 버전길이 끝에 5(0.0.1 => 5개)를 문자 개수만큼 바꾸셈. 이럴꺼면 버전 길이 왜보내는거임?? 토탈 길이를 아오
  const totalHeaderLength =
    config.packet.packetTypeLength +
    config.packet.versionLength +
    config.packet.sequenceLength +
    config.packet.payloadLength +
    5;

  while (socket.buffer.length >= totalHeaderLength) {
    // 1. packetType (2 bytes)
    const packetpacketType = socket.buffer.readUInt16BE(0);

    // 2. versionLength (1 byte), config.packet.packetTypeLength = 2
    const versionLength = socket.buffer.readUInt8(config.packet.packetTypeLength);

    // 3. version (versionLength bytes), config.packet.packetTypeLength + config.packet.versionLength = 3
    const packetversion = socket.buffer.toString(
      'utf8',
      config.packet.packetTypeLength + config.packet.versionLength,
      config.packet.packetTypeLength + config.packet.versionLength + versionLength,
    );

    // 4. sequence (4 bytes)
    const packetsequence = socket.buffer.readUInt32BE(
      config.packet.packetTypeLength + config.packet.versionLength + versionLength,
    );

    // 5. payloadLength (4 bytes), config.packet.packetTypeLength + config.packet.versionLength + config.packet.sequenceLength =7
    const payloadLength = socket.buffer.readUInt32BE(
      config.packet.packetTypeLength +
        config.packet.versionLength +
        config.packet.sequenceLength +
        versionLength,
    );

    // 6. payload (payloadLength bytes), config.packet.packetTypeLength + config.packet.versionLength + config.packet.sequenceLength+ config.packet.payloadLength =11 존나기네..
    const packetpayload = socket.buffer.slice(
      config.packet.packetTypeLength +
        config.packet.versionLength +
        config.packet.sequenceLength +
        config.packet.payloadLength +
        versionLength,
      config.packet.packetTypeLength +
        config.packet.versionLength +
        config.packet.sequenceLength +
        config.packet.payloadLength +
        versionLength +
        payloadLength,
    );

    if (
      socket.buffer.length >=
      config.packet.packetTypeLength +
        config.packet.versionLength +
        config.packet.sequenceLength +
        config.packet.payloadLength +
        versionLength +
        payloadLength
    ) {
      socket.buffer = socket.buffer.slice(
        config.packet.packetTypeLength +
          config.packet.versionLength +
          config.packet.sequenceLength +
          config.packet.payloadLength +
          versionLength +
          payloadLength,
      );

      try {
        console.log("packetType:",packetpacketType,"\npayload:", packetpayload );
        const { packetType, sequence, payload } = packetParser(packetpacketType, packetversion, packetsequence, packetpayload);
        
        const handler = getHandlerById(packetType);
        await handler({
          socket,
          sequence,
          payload,
        });

      } catch (error) {
        console.error(error);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;
    }
  }
};
