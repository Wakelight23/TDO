import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);//현재 파일의 절대 경로.
const __dirname = path.dirname(__filename);//파일 이름 뺀 경로.
const basePath = path.join(__dirname, '../../assets'); // 여기서 뒤로 두번. 그뒤 에셋파일 열기.
let gameAssets = {};

//assets 파일안에 있는걸 읽는 함수, 물론 basePath가 달라지면 달라지겠지.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data)); //제이슨 형태로 반환해주기.
    });
  });
};

export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks }; //그냥 전역변수가 된다네.
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
