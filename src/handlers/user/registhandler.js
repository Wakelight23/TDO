import { PacketType } from '../../constants/header.js';
import pools from '../../db/database.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';

const registHandler = async ({ socket, sequence, payload }) => {
  try {
    const { email, id, password } = payload;

    // 이메일 유효성 검사
    const validateEmail = (email) => {
      const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,}$/; // 이메일 형식 검사
      return emailRegex.test(email);
    };

    if (!validateEmail(email)) {
      const failResponse = createResponse(
        PacketType.REGISTER_RESPONSE,
        {
          success: false,
          message: 'Invalid email format',
          failCode: 2, // INVALID_REQUEST
        },
        sequence,
      );
      return socket.write(failResponse);
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 중복 이메일 확인
    const [emailRows] = await pools.TDO_USER_DB.query('SELECT * FROM USER WHERE email = ?', [
      email,
    ]);
    if (emailRows.length > 0) {
      const failResponse = createResponse(
        PacketType.REGISTER_RESPONSE,
        {
          success: false,
          message: 'Email already exists',
          failCode: 3, // AUTHENTICATION_FAILED
        },
        sequence,
      );
      return socket.write(failResponse);
    }

    // 중복 로그인 ID 확인
    const [loginIdRows] = await pools.TDO_USER_DB.query('SELECT * FROM USER WHERE login_id = ?', [
      id,
    ]);
    if (loginIdRows.length > 0) {
      const failResponse = createResponse(
        PacketType.REGISTER_RESPONSE,
        {
          success: false,
          message: 'Login ID already exists',
          failCode: 3, // AUTHENTICATION_FAILED
        },
        sequence,
      );
      return socket.write(failResponse);
    }

    // 사용자 추가
    console.log(id);
    await pools.TDO_USER_DB.query(
      'INSERT INTO USER (user_id, email, login_id, password) VALUES (UUID(), ?, ?, ?)',
      [email, id, hashedPassword],
    );

    const successPayload = {
      success: true,
      message: 'Signup successful!',
      failCode: 0, // NONE
    };

    const successResponse = createResponse(PacketType.REGISTER_RESPONSE, successPayload, sequence);
    socket.write(successResponse);
  } catch (error) {
    console.error('Error in registHandler:', error);

    const errorResponse = createResponse(
      PacketType.REGISTER_RESPONSE,
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

export default registHandler;
