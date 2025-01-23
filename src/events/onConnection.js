import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';

export const onConnection = (socket, activeClients) => {
  const clientKey = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log('클라이언트가 연결되었습니다:', clientKey);

  // 각 클라이언트마다 고유한 버퍼를 유지하기 위해 생성
  socket.buffer = Buffer.alloc(0);

  // TCP Keep-Alive 활성화
  socket.setKeepAlive(true, 2000); // 10초마다 Keep-Alive 패킷 전송

  // 클라이언트를 activeClients에 추가
  activeClients.set(clientKey, socket);

  // 데이터 수신 이벤트 처리
  socket.on('data', async (data) => {
    try {
      await onData(socket)(data);
    } catch (error) {
      console.error('데이터 처리 중 오류 발생:', error.message);
      socket.destroy(); // 소켓을 안전하게 닫음
    }
  });

  // 연결 종료 이벤트 처리
  socket.on('end', () => {
    console.log('클라이언트 연결이 종료되었습니다:', clientKey);
    activeClients.delete(clientKey); // 연결 종료 시 activeClients에서 제거
    onEnd(socket)(); // 기존 onEnd 호출
  });

  // 에러 발생 이벤트 처리
  socket.on('error', (err) => {
    console.error('소켓 에러 발생:', clientKey, err.message);
    activeClients.delete(clientKey); // 에러 발생 시 activeClients에서 제거
    onError(socket)(err); // 기존 onError 호출
  });
};

// 이전 세션 복구 함수
export const recoverSessions = (activeClients) => {
  console.log('서버 재시작 후 이전 세션 복구 중...');

  if (activeClients.size === 0) {
    console.log('복구할 세션이 없습니다.');
    return;
  }

  for (const [clientKey, socket] of activeClients.entries()) {
    console.log(`복구된 세션: ${clientKey}`);
    if (!socket.destroyed) {
      console.log(`세션이 여전히 활성화되어 있습니다: ${clientKey}`);
      try {
        socket.write(
          JSON.stringify({ type: 'SERVER_RESTARTED', message: '서버가 재시작되었습니다.' }),
        );
      } catch (error) {
        console.error(`복구 작업 중 오류 발생: ${error.message}`);
        activeClients.delete(clientKey); // 오류 발생 시 세션 제거
      }
    } else {
      console.log(`세션이 비활성화되어 제거합니다: ${clientKey}`);
      activeClients.delete(clientKey); // 비활성화된 세션 제거
    }
  }

  console.log('세션 복구 작업 완료.');
};

// export const onConnection = (socket) => {
//   console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);

//   //각 클라이 언트마다 고유한 버퍼를 유지하기 위해 생성.
//   //여기에 전송받은 데이터를 쌓기 위해서 라고 한다.
//   socket.buffer = Buffer.alloc(0);

//   socket.on('data', onData(socket));
//   socket.on('end', onEnd(socket));
//   socket.on('error', onError(socket));
// };
