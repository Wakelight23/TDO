import dotenv from 'dotenv';

dotenv.config();

/* IP, PORT 설정 */
export const PORT = process.env.PORT || 5555;
export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

/* DB 설정 */
export const DB1_HOST = process.env.DB_HOST || 'localhost';
export const DB1_USER = process.env.DB_USER || 'root';
export const DB1_PASSWORD = process.env.DB_PASSWORD || 'password1';
export const DB1_NAME = process.env.DB_NAME || 'user';
export const DB1_PORT = process.env.DB_PORT || 3306;

/* Master Key */
export const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key';

/* 타워 구매 시 확률 설정 */
export const NOMAL_TOWER = process.env.NOMAL_TOWER || 70;
export const GOLD_TOWER = process.env.GOLD_TOWER || 13;
export const SCORE_TOWER = process.env.SCORE_TOWER || 13;
export const BOTH_TOWER = process.env.BOTH_TOWER || 4;

/* 게임 플레이 시 필요한 변수 */
export const ONE_SECOND_FRAME = process.env.ONE_SECOND_FRAME || 1000; //현재 javascript에서 1초를 나타내는 수
export const LEVEL_BOSS_SPAWN = process.env.LEVEL_BOSS_SPAWN || 6;

export const LEVEL_INITIAL_VIGILANCE = process.env.LEVEL_INITIAL_VIGILANCE || 500; //레벨이 1일 때 다음으로 넘어가는 보더라인
export const FRAME_DIVISION = process.env.FRAME_DIVISION || 1000; //프레임 값을 나눌 때 쓰는 상수
export const LEVEL_BASED_MULTIPLIER = process.env.LEVEL_BASED_MULTIPLIER || 100; //레벨이 높아질 때마다 현재 레벨의 값을 기반으로 보더라인을 다시 계산할 때 쓸 상수
