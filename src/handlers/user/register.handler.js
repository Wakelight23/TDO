import { PacketType } from '../../constants/header.js';
import {
  createUser,
  findUserByHighScore,
  findUserByEmail,
  findUserByLoginId,
} from '../../db/user/user.db.js';
import { addUser, isUserLoggedIn } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../constants/env.js';
import bcrypt from 'bcrypt';
import User from '../../classes/models/user.class.js';

const registerHandler = async ({ socket, sequence, payload }) => {
  const { email, id, password } = payload;

  if (email === 'login') {
    try {
      const { id, password } = payload;

      // 로그인 ID로 사용자 검색
      const userData = await findUserByLoginId(id);
      if (!userData) {
        const failResponse = createResponse(
          PacketType.LOGIN_RESPONSE,
          {
            success: false,
            message: ' User not found',
            failCode: 3, // AUTHENTICATION_FAILED
          },
          sequence,
        );
        console.log('1 failResponse : ' + failResponse);
        return socket.write(failResponse);
      }

      // 비밀번호 검증
      console.log('Entered password:', password); // 입력된 비밀번호
      console.log('Hashed password from DB:', userData.password); // DB에서 가져온 해시된 비밀번호

      const passwordMatch = await bcrypt.compare(password, userData.password);

      // 비교 결과 로그 추가
      console.log('Password match result:', passwordMatch); // true여야 정상

      if (!passwordMatch) {
        const failResponse = createResponse(
          PacketType.LOGIN_RESPONSE,
          {
            success: false,
            message: ' Invalid credentials',
            failCode: 3, // AUTHENTICATION_FAILED
          },
          sequence,
        );
        console.log('2 failResponse : ' + failResponse);
        return socket.write(failResponse);
      }

      // 중복 로그인 방지
      if (isUserLoggedIn(id)) {
        const failResponse = createResponse(
          PacketType.LOGIN_RESPONSE,
          {
            success: false,
            message: ' User already logged in',
            failCode: 4, // USER_ALREADY_LOGGED_IN
          },
          sequence,
        );
        console.log('3 fail Response :', failResponse);
        return socket.write(failResponse);
      }

      // User 클래스 인스턴스 생성
      const user = new User(socket, userData.highscore, userData.loginId, userData.userId);

      // 마지막 로그인 시간 업데이트
      await userData.updateLastLogin();

      // JWT 생성
      const token = jwt.sign({ userId: userData.userId, login_id: userData.loginId }, SECRET_KEY, {
        expiresIn: '1h',
      });

      const successPayload = {
        success: true,
        message: ' Login successful',
        token, // JWT 발급
        failCode: 0, // NONE
      };

      const successResponse = createResponse(PacketType.LOGIN_RESPONSE, successPayload, sequence);
      socket.write(successResponse);
      console.log('Login success response: ' + successResponse);

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
  } else {
    try {
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
        console.log('email failResponse : ' + failResponse);
        return socket.write(failResponse);
      }

      // 중복 이메일 확인
      const existingUserByEmail = await findUserByEmail(email);
      if (existingUserByEmail) {
        const failResponse = createResponse(
          PacketType.REGISTER_RESPONSE,
          {
            success: false,
            message: 'Email already exists',
            failCode: 3, // AUTHENTICATION_FAILED
          },
          sequence,
        );
        console.log('Fail : ' + failResponse);
        return socket.write(failResponse);
      }

      // 중복 로그인 ID 확인
      const existingUserByLoginId = await findUserByLoginId(id);
      if (existingUserByLoginId) {
        const failResponse = createResponse(
          PacketType.REGISTER_RESPONSE,
          {
            success: false,
            message: ' Login ID already exists',
            failCode: 3, // AUTHENTICATION_FAILED
          },
          sequence,
        );
        console.log('Fail : ' + failResponse);
        return socket.write(failResponse);
      }

      // 사용자 추가
      await createUser(email, id, password);

      const successPayload = {
        success: true,
        message: 'Signup successful!',
        failCode: 0, // NONE
      };

      console.log('회원가입이 되었습니다.');

      const successResponse = createResponse(
        PacketType.REGISTER_RESPONSE,
        successPayload,
        sequence,
      );
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
  }
};

export default registerHandler;
