import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

const registHandler = async ({ socket, sequence, payload }) => {
  try {
    const { id, password, email } = payload;


    
    const registpayload = {
      success: true,
      message: '회원가입 성공!',
      failCode: 0,
    };
    
    const packetType = PacketType.REGISTER_RESPONSE;
    const registResponse = createResponse(packetType, registpayload, sequence);
    socket.write(registResponse);
  } catch (error) {
    console.error(error);
  }
};

export default registHandler;
