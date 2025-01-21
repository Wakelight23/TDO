import { PacketType } from '../../constants/header.js';
import { addUser } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const loginHandler = async ({ socket, sequence, payload }) => {
  try {
    const { id, password } = payload;



    addUser(socket);



    const loginpayload = {
      success: true,
      message: '로그인 성공!',
      token: '임시토큰입니다.',
      failCode: 0,
    };
    const packetType = PacketType.LOGIN_RESPONSE;
    const loginResponse = createResponse(packetType, loginpayload, sequence);
    socket.write(loginResponse);
  } catch (error) {
    console.error(error);
  }
};

export default loginHandler;
