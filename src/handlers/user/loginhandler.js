import { PacketType } from '../../constants/header.js';
import { findUserByHighScore, findUserByLoginId } from '../../db/user/user.db.js';
import { addUser, removeUser, isUserLoggedIn } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../constants/env.js';

const loginHandler = async ({ socket, sequence, payload }) => {
  try {
    const { id, password } = payload; // 로그인 ID 기반으로 로그인 처리

    // 로그인 중인 사용자 확인
    if (isUserLoggedIn(id)) {
      // 이미 로그인 중인 사용자인지 확인
      const existingUser = userSessions.find((user) => user.id === id); // 기존 로그인 중인 사용자 찾기

      // 기존 사용자가 있으면 해당 소켓을 제거하고 새로운 로그인 처리
      if (existingUser) {
        removeUser(existingUser.socket); // 기존 사용자 로그아웃 처리
      }
    }

    // 로그인 ID로 사용자 검색
    const user = await findUserByLoginId(id); // findUserByLoginId 함수 사용

    if (!user) {
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
    await user.updateLastLogin();

    // JWT 생성
    const token = jwt.sign({ userId: user.user_id, login_id: user.login_id }, SECRET_KEY, {
      expiresIn: '1h',
    });

    const successPayload = {
      success: true,
      message: 'Login successful',
      token, // JWT 발급
      failCode: 0, // NONE
    };

    const successResponse = createResponse(PacketType.LOGIN_RESPONSE, successPayload, sequence);
    socket.write(successResponse);

    // DB에 저장된 login_id를 토대로 highscore를 가져온다
    const highScoreData = await findUserByHighScore(id);

    addUser(socket, highScoreData.highscore, id); // 소켓을 세션에 추가
    console.log('highScore, user_id : ', highScoreData.highscore, user.user_id);
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
