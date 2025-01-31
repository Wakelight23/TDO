import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection, recoverSessions } from './events/onConnection.js';

const activeClients = new Map(); // 활성 클라이언트를 관리하기 위한 Map 객체

const server = net.createServer((socket) => {
  onConnection(socket, activeClients); // onConnection 호출 시 activeClients 전달
});

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port} 에서 실행 중입니다.`);
      recoverSessions(activeClients); // 서버 초기화 후 세션 복구
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });

// Nodemon 종료 신호 처리
const shutdownHandler = () => {
  console.log('서버 종료 처리 중...');
  server.close(() => {
    console.log('서버가 안전하게 종료되었습니다.');
    process.exit(0);
  });
};

process.once('SIGINT', shutdownHandler); // Windows (CTRL+C)
