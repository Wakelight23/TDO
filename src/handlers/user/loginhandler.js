import { PacketType } from '../../constants/header.js';
import { findUserByHighScore, findUserByLoginId } from '../../db/user/user.db.js';
import { addUser, isUserLoggedIn } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../constants/env.js';
import User from '../../classes/models/user.class.js'; // User 클래스 import

const loginHandler = async ({ socket, sequence, payload }) => {
  try {
    const { id, password } = payload;

    // 로그인 ID로 사용자 검색
    const userData = await findUserByLoginId(id);
    console.log('1');
    if (!userData) {
      const failResponse = createResponse(
        PacketType.LOGIN_RESPONSE,
        {
          success: false,
          message: 'User not found',
          failCode: 3, // AUTHENTICATION_FAILED
        },
        sequence,
      );
      console.log('1 failResponse' + failResponse);
      return socket.write(failResponse);
    }

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, userData.password);
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
      console.log('2 failResponse' + failResponse);
      return socket.write(failResponse);
    }
    console.log('2');

    // 중복 로그인 방지
    if (isUserLoggedIn(id)) {
      const failResponse = createResponse(
        PacketType.LOGIN_RESPONSE,
        {
          success: false,
          message: 'User already logged in',
          failCode: 4, // USER_ALREADY_LOGGED_IN
        },
        sequence,
      );
      console.log('3 failResponse : ' + failResponse);
      return socket.write(failResponse);
    }
    console.log('3');

    // User 클래스 인스턴스 생성
    const user = new User(socket, userData.highscore, userData.loginId, userData.userId);

    // 마지막 로그인 시간 업데이트
    await userData.updateLastLogin();
    console.log('4');

    // JWT 생성
    const token = jwt.sign({ userId: userData.userId, login_id: userData.loginId }, SECRET_KEY, {
      expiresIn: '1h',
    });

    const successPayload = {
      success: true,
      message: 'Login successful',
      token, // JWT 발급
      failCode: 0, // NONE
    };

    console.log(successPayload.token);

    const successResponse = createResponse(PacketType.LOGIN_RESPONSE, successPayload, sequence);
    socket.write(successResponse);
    console.log('successResponse : ' + successResponse);
    // DB에 저장된 login_id를 토대로 highscore를 가져온다
    const highScoreData = await findUserByHighScore(id);

    // 세션에 사용자 추가
    addUser(socket, highScoreData.highscore, id);
    console.log('highScore, user_id : ', highScoreData.highscore, userData.userId);
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
