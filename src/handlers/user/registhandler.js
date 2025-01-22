import { PacketType } from '../../constants/header.js';
import pools from '../../db/database.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise'; // promise 기반 MySQL

const registHandler = async ({ socket, sequence, payload }) => {
  try {
    const { email, password } = payload;

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
    const [rows] = await pools.TDO_USER_DB.query('SELECT * FROM USER WHERE email = ?', [email]);
    if (rows.length > 0) {
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

    // 사용자 추가
    await pools.TDO_USER_DB.query(
      'INSERT INTO USER (user_id, email, password) VALUES (UUID(), ?, ?)',
      [email, hashedPassword],
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
