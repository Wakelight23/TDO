import { HANDLER_IDS } from '../constants/handlerIds.js';
import gameEndHandler from './game/gameEndhandler.js';
import matchHandler from './matching/matchhandler.js';
import monsterAttackBaseHandler from './monster/monsterAttackBasehandler.js';
import monsterDeathNotificationHandler from './monster/monsterDeathNotificationhandler.js';
import spawnMonsterHandler from './monster/spawnMonsterhandler.js';
import testHandler from './test/testhandler.js';
import towerAttackHandler from './tower/towerAttackhandler.js';
import towerPurchaseHandler from './tower/towerPurchasehandler.js';
import loginHandler from './user/loginhandler.js';
import registHandler from './user/registhandler.js';

const handlers = {
  [HANDLER_IDS.REGISTEREQUST]: {
    handler: registHandler,
    protoType: 'packets.C2SRegisterRequest',
    packetname: 'registerRequest',
  },
  [HANDLER_IDS.REGISTERESPONSE]: {
    //handler: testHandler,
    protoType: 'packets.S2CRegisterResponse',
    packetname: 'registerResponse',
  },
  [HANDLER_IDS.LOGINREQUEST]: {
    handler: loginHandler,
    protoType: 'packets.C2SLoginRequest',
    packetname: 'loginRequest',
  },
  [HANDLER_IDS.LOGINRESPONSE]: {
    //handler: testHandler,
    protoType: 'packets.S2CLoginResponse',
    packetname: 'loginResponse',
  },
  [HANDLER_IDS.MATCHREQUST]: {
    handler: matchHandler,
    protoType: 'packets.C2SMatchRequest',
    packetname: 'matchRequest',
  },
  [HANDLER_IDS.MATCHSTARTNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CMatchStartNotification',
    packetname: 'matchStartNotification',
  },
  [HANDLER_IDS.STATESYNCNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CStateSyncNotification',
    packetname: 'stateSyncNotification',
  },
  [HANDLER_IDS.TOWERPURCHASEREQUST]: {
    handler: towerPurchaseHandler,
    protoType: 'packets.C2STowerPurchaseRequest',
    packetname: 'towerPurchaseRequest',
  },
  [HANDLER_IDS.TOWERPURCHASERESPONSE]: {
    //handler: testHandler,
    protoType: 'packets.S2CTowerPurchaseResponse',
    packetname: 'towerPurchaseResponse',
  },
  [HANDLER_IDS.ADDENEMYTOWERNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CAddEnemyTowerNotification',
    packetname: 'addEnemyTowerNotification',
  },
  [HANDLER_IDS.SPAWNMONSTERREQUST]: {
    handler: spawnMonsterHandler,
    protoType: 'packets.C2SSpawnMonsterRequest',
    packetname: 'spawnMonsterRequest',
  },
  [HANDLER_IDS.SPAWNMONSTERRESPONSE]: {
    //handler: testHandler,
    protoType: 'packets.S2CSpawnMonsterResponse',
    packetname: 'spawnMonsterRespons',
  },
  [HANDLER_IDS.SPAWNMONSTERNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CSpawnEnemyMonsterNotification',
    packetname: 'spawnEnemyMonsterNotification',
  },
  [HANDLER_IDS.TOWERATTACKREQUST]: {
    handler: towerAttackHandler,
    protoType: 'packets.C2STowerAttackRequest',
    packetname: 'towerAttackRequest',
  },
  [HANDLER_IDS.ENEMYTOWERATTACKNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CEnemyTowerAttackNotification',
    packetname: 'enemyTowerAttackNotification',
  },
  [HANDLER_IDS.MONSTERATTACKBASEREQUST]: {
    handler: monsterAttackBaseHandler,
    protoType: 'packets.C2SMonsterAttackBaseRequest',
    packetname: 'monsterAttackBaseRequest',
  },
  [HANDLER_IDS.UPDATEBASEHPNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CUpdateBaseHPNotification',
    packetname: 'updateBaseHpNotification',
  },
  [HANDLER_IDS.GAMEOVERNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CGameOverNotification',
    packetname: 'gameOverNotification',
  },
  [HANDLER_IDS.GAMEENDREQUST]: {
    handler: gameEndHandler,
    protoType: 'packets.C2SGameEndRequest',
    packetname: 'gameEndRequest',
  },
  [HANDLER_IDS.MONSTERDEATHNOTIFICATION]: {
    handler: monsterDeathNotificationHandler,
    protoType: 'packets.C2SMonsterDeathNotification',
    packetname: 'monsterDeathNotification',
  },
  [HANDLER_IDS.ENEMYMONSTERDEATHNOTIFICATION]: {
    //handler: testHandler,
    protoType: 'packets.S2CEnemyMonsterDeathNotification',
    packetname: 'enemyMonsterDeathNotification',
  },
};

export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    console.error(`핸들러를 찾을 수 없습니다: ID ${handlerId}`);
  }
  return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    // packetParser 체크하고 있지만 그냥 추가합니다.
    console.error(`핸들러를 찾을 수 없습니다: ID ${handlerId}`);
  }
  return handlers[handlerId].protoType;
};

export const getpacketnameByHandlerId = (handlerId) => {
  if (!handlers[handlerId]) {
    console.error(`핸들러를 찾을 수 없습니다: ID ${handlerId}`);
  }
  return handlers[handlerId].packetname;
};
