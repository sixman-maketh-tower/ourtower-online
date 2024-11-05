import { loadServerGameAssets } from './assets.js';
import { loadProtos } from './proto.js';

const initServer = async () => {
  try {
    // 모든 asset 파일들을 로딩한다.
    await loadServerGameAssets();
    // 모든 proto 파일들을 로딩한다.
    await loadProtos();
  } catch (err) {
    console.error(err);

    // process.exit(code) : 수동으로 프로세스 종료시키는 함수
    // code
    // - 0 : default Code  (성공적인 종료)
    // - 1 ~ 255 : error Code
    process.exit(1);
  }
};

export default initServer;
