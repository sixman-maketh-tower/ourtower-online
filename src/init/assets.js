import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 파일의 절대 경로. 이 경로는 파일의 이름을 포함한 전체 경로
const __filename = fileURLToPath(import.meta.url);
// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const __dirname = path.dirname(__filename);

const assetPath = path.join(__dirname, '../../assets');

let gameAssets = {};

// 파일 읽는 함수
// 비동기 병렬로 파일을 읽는다.
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(assetPath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// Promise.all()
export const loadServerGameAssets = async () => {
  try {
    const [stages, towers, monsters] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('tower.json'),
      readFileAsync('monster.json'),
    ]);

    gameAssets = { stages, towers, monsters };
    return gameAssets;
  } catch (err) {
    throw new Error('Failed to load game assets: ' + err.message);
  }
};

export const getServerGameAssets = () => {
  return gameAssets;
};
