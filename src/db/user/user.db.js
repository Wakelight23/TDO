import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email) => {
  const [rows] = await pools.TDO_USER_DB.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
  return toCamelCase(rows[0]);
};

export const findUserByHighScore = async (id) => {
  const [rows] = await pools.TDO_USER_DB.query(SQL_QUERIES.FIND_USER_BY_HIGHSCORE, [id]);
  return toCamelCase(rows[0]);
};

export const createUser = async (email, loginId, password) => {
  const userId = uuidv4(); // UUID 생성
  const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱

  // 사용자 생성 쿼리 실행
  await pools.TDO_USER_DB.query(SQL_QUERIES.CREATE_USER, [userId, email, loginId, hashedPassword]);

  return { userId, email, loginId }; // 새로 생성된 사용자 정보 반환
};

export const updateUserLogin = async (id) => {
  await pools.TDO_USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const updateDBHighScore = async (id, newHighScore) => {
  await pools.TDO_USER_DB.query(SQL_QUERIES.UPDATE_USER_HIGHSCORE, [newHighScore, id]);
};

export const findUserByLoginId = async (loginId) => {
  const [rows] = await pools.TDO_USER_DB.query(SQL_QUERIES.FIND_USER_BY_LOGIN_ID, [loginId]);
  if (rows.length > 0) {
    const user = toCamelCase(rows[0]);

    // updateLastLogin 메서드 추가
    user.updateLastLogin = async () => {
      await pools.TDO_USER_DB.query(SQL_QUERIES.UPDATE_USER_LAST_LOGIN, [user.user_id]);
    };

    return user;
  } else {
    return null;
  }
};
