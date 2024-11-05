import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

// 현재 파일의 절대 경로. 이 경로는 파일의 이름을 포함한 전체 경로
const __filename = fileURLToPath(import.meta.url);
// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const __dirname = path.dirname(__filename);

const protoDir = path.join(__dirname, '../protobuf');

const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// 모든 proto 파일 경로를 세팅해준다.
const protoFiles = getAllProtoFiles(protoDir);

// protoMessages : 각 proto 파일의 message를 읽어서 저장할 객체
const protoMessages = {};

export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    // 모든 proto 파일들을 root 하위 Node에 로딩한다.
    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (const typeName of Object.values(packetNames)) {
      protoMessages[typeName] = root.lookupType(typeName);
    }

    console.log(`ProtoBuf 파일 로드에 성공하였습니다.`);
  } catch (err) {
    console.error(`ProtoBuf 파일 로드 중 오류가 발생했습니다: ${err}`);
  }
};

export const getProtoMessages = () => {
  // 깊은 복사로 사본의 protoMessages를 return
  return { ...protoMessages };
};
