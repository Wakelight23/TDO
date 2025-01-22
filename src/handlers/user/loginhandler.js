import { PacketType } from '../../constants/header.js';
import pools from '../../db/database.js';
import { addUser } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise'; // promise 기반 MySQL

const loginHandler = async ({ socket, sequence, payload }) => {
  try {
    const { id, password } = payload; // email 기반으로 로그인 처리

    // 이메일로 사용자 검색
    console.log(payload);
    const [rows] = await pools.TDO_USER_DB.query('SELECT * FROM USER WHERE email = ?', [id]);
    if (rows.length === 0) {
      const failResponse = createResponse(
        PacketType.LOGIN_RESPONSE,
        {
          success: false,
          message: 'User not found',
          failCode: 3, // AUTHENTICATION_FAILED
        },
        sequence,
      );
      return socket.write(failResponse);
    }

    const user = rows[0];

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const failResponse = createResponse(
        PacketType.LOGIN_RESPONSE,
        {
          success: false,
          message: 'Invalid credentials',
          failCode: 3, // AUTHENTICATION_FAILED
        },
        sequence,
      );
      return socket.write(failResponse);
    }

    // 마지막 로그인 시간 업데이트
    await pools.TDO_USER_DB.query(
      'UPDATE USER SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
      [user.user_id],
    );

    // JWT 생성 (임시 토큰 메시지로 대체)
    const successPayload = {
      success: true,
      message: 'Login successful',
      token: 'TemporaryToken', // 실제 구현 시 JWT 발급
      failCode: 0, // NONE
    };

    const successResponse = createResponse(PacketType.LOGIN_RESPONSE, successPayload, sequence);
    socket.write(successResponse);

    addUser(socket); // 소켓을 세션에 추가
  } catch (error) {
    console.error('Error in loginHandler:', error);

    const errorResponse = createResponse(
      PacketType.LOGIN_RESPONSE,
      {
        success: false,
        message: 'Unknown error occurred',
        failCode: 1, // UNKNOWN_ERROR
      },
      sequence,
    );
    socket.write(errorResponse);
  }
};

export default loginHandler;
