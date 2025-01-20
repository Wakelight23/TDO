 // 서버 초기화 작업
 import { loadGameAssets } from './assets.js';
 import { loadProtos } from './loadProtos.js';
 
 const initServer = async () => { //이곳은 서버가 시작되기 전에 시작되는 것.
   try {
     await loadGameAssets();
     await loadProtos();
     // 다음 작업
   } catch (e) {
     console.error(e);
     process.exit(1); // 오류 발생 시 프로세스 종료
   }
 };
 
 export default initServer;