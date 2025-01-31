import { getHandlerById } from '../../handlers/index.js';

const customPacketParserHandler = async ({ socket, sequence, payload }) => {
  //id = 토큰, password는 {packetType, handlerpayload} 여기서 가공.
  const { id, password } = payload;

  //console.log('id:', id);
  //console.log('password:', password);

  let parsedPassword;
  try {
    parsedPassword = JSON.parse(password);
  } catch (error) {
    console.error('어 안돼 돌아가.', error);
    throw new Error('우린 안되.');
  }
  //console.log('parsedPassword:', parsedPassword);

  const { packetType, ...handlerPayload } = parsedPassword;

  const handler = getHandlerById(packetType);

  //console.log('handlerPayload:', handlerPayload);

  await handler({ socket: socket, sequence: sequence, payload: handlerPayload });
};

export default customPacketParserHandler;
