import { PacketType } from '../../constants/header.js';
import { createResponse } from '../../utils/response/createResponse.js';

const gameEndHandler = async ({ socket, sequence, payload }) => {
  try {
    const { } = payload; 

    //게임 정리, 후속 처리(점수 기록) 같은거 하면 될듯. 유저 점수 말곤 초기화 같은거.


  } catch (error) {
    console.error(error);
  }
};

export default gameEndHandler;
