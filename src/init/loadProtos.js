import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs'; //프로토 뭐 할때 쓰는거 다 가져오기.
import { packetNames } from '../protobuf/packetNames.js';

// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로토파일이 있는 디렉토리 경로 설정
const protoDir = path.join(__dirname, '../protobuf');

// 주어진 디렉토리 내 모든 proto 파일을 재귀적으로 찾는 함수
const getAllProtoFiles = (dir, fileList = []) => { //만약 기존에 사용하던게 있으면 여기서 받아서 사용.
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) { //statSync(filePath)-> 확인해 보기, 이게 뭔지.isDirectory() 디렉토리라면~~
      getAllProtoFiles(filePath, fileList); //디렉토리면 다시 들어가기.
    } else if (path.extname(file) === '.proto') {//확장자 이름이 프로토일때만.
      fileList.push(filePath);
    }
  });
  return fileList;
};

// 모든 proto 파일 경로를 가져옴
const protoFiles = getAllProtoFiles(protoDir);

// 로드된 프로토 메시지들을 저장할 객체
const protoMessages = {};

// 모든 .proto 파일을 로드하여 프로토 메시지를 초기화합니다.
export const loadProtos = async () => {
  try {
    const root = new protobuf.Root(); //여기서 인스턴스 생성. root 가 밑에서 로드해줌. 프로토 파일들을.

    // 비동기 병렬 처리로 프로토 파일 로드
    await Promise.all(protoFiles.map((file) => root.load(file))); //파일을 로드.

    // packetNames 에 정의된 패킷들을 등록
    for (const [namespace, types] of Object.entries(packetNames)) {
      protoMessages[namespace] = {};
      for (const [type, typeName] of Object.entries(types)) {
        if (typeName.endsWith('Code')) { // 예: GlobalFailCode처럼 enum인 경우
          protoMessages[namespace][type] = root.lookupEnum(typeName);
        } else {
          protoMessages[namespace][type] = root.lookupType(typeName);
        }
      }
    }

    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다:', error);
  }
};

// 로드된 프로토 메시지들의 얕은 복사본을 반환합니다.
export const getProtoMessages = () => {
  // console.log('protoMessages:', protoMessages); // 디버깅을 위해 추가
  return { ...protoMessages };
};
