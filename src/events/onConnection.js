import { onEnd } from './onEnd.js';
import { onError } from './onError.js';
import { onData } from './onData.js';

export const onConnection = (socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.remoteAddress, socket.remotePort);
  
  //각 클라이 언트마다 고유한 버퍼를 유지하기 위해 생성.
  //여기에 전송받은 데이터를 쌓기 위해서 라고 한다.
  socket.buffer = Buffer.alloc(0); 

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
