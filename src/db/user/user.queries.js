export const SQL_QUERIES = {
  FIND_USER_BY_EMAIL: 'SELECT * FROM USER WHERE email = ?',
  FIND_USER_BY_HIGHSCORE: 'SELECT highscore FROM USER WHERE login_id = ?',
  CREATE_USER: 'INSERT INTO USER (user_id, email, login_id, password) VALUES (?, ?, ?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE USER SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  UPDATE_USER_HIGHSCORE: 'UPDATE USER SET highscore = ? WHERE login_id = ?',
  FIND_USER_BY_LOGIN_ID: 'SELECT * FROM USER WHERE login_id = ?',
  UPDATE_USER_LAST_LOGIN: 'UPDATE USER SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
};
