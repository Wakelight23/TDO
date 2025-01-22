import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pools.TDO_USER_DB.query(SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
  return toCamelCase(rows[0]);
};

export const createUser = async (email) => {
  const id = uuidv4();
  await pools.TDO_USER_DB.query(SQL_QUERIES.CREATE_USER, [id, email]);
  return { id, email };
};

export const updateUserLogin = async (id) => {
  await pools.TDO_USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const updateDBHighScore = async (id, newHighScore) => {
  await pools.TDO_USER_DB.query(SQL_QUERIES.UPDATE_USER_HIGHSCORE, [newHighScore, id]);
};

export const updateHighScoreByEmail = async (email, newHighScore) => {
  await pools.TDO_USER_DB.query('UPDATE USER SET highscore = ? WHERE email = ?', [
    newHighScore,
    email,
  ]);
};
