import { PacketType } from '../../constants/header.js';
import { addGameSession,getAllGameSessions } from '../../session/game.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { v4 as uuidv4 } from 'uuid';

const matchHandler = async ({ socket, sequence, payload }) => {
  try {
    const {  } = payload; //없음.?? 이게 왜없지. 아니 소켓으로 유저 찾아서 매칭해야하네.


    const user = getUserBySocket(socket);

    let gameSession = getAllGameSessions().find((session) => session.users.length === 1);

    if (gameSession) {
      gameSession.addUser(user);
      //게임 시작 함수. 넣어주기.
    } else {
      const gameId = uuidv4();
      gameSession = addGameSession(gameId);
      gameSession.addUser(user);
    }
    

    const matchStartpayload = {
      initialGameState: {
        baseHp: 100,
        towerCost: 100,
        initialGold: 100,
        monsterSpawnInterval: 100,
      },
      playerData: {
        gold: 100,
        base: {
          hp: 100,
          maxHp: 100,
        },
        highScore: 100,
        towers: [{
          towerId: 100,
          x: 0.1,
          y: 0.1,
        }],
        monsters:[{
          monsterId: 100,
          monsterNumber: 100,
          level: 100,
        }],
        monsterLevel: 100,
        score: 100,
        monsterPath: [{
          x: 0.1,
          y: 0.1,
        }],
        basePosition: {
          x: 0.1,
          y: 0.1,
        },
      },
      opponentData: {
        gold: 100,
        base: {
          hp: 100,
          maxHp: 100,
        },
        highScore: 100,
        towers: [{
          towerId: 100,
          x: 0.1,
          y: 0.1,
        }],
        monsters:[{
          monsterId: 100,
          monsterNumber: 100,
          level: 100,
        }],
        monsterLevel: 100,
        score: 100,
        monsterPath: [{
          x: 0.1,
          y: 0.1,
        }],
        basePosition: {
          x: 0.1,
          y: 0.1,
        },
      },
    };

    const packetType = PacketType.MATCH_START_NOTIFICATION;
    const matchStartResponse = createResponse(packetType, matchStartpayload, sequence);
    socket.write(matchStartResponse);



  } catch (error) {
    console.error(error);
  }
};

export default matchHandler;
