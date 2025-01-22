# TDO

Tower Defense Online

# 현재 이 곳에서 관리해야 할 패킷들

|||
|---|---|
|gameNotification.MonsterData | 몬스터의 데이터를 관리하는 패킷, monsterID, monsterNumber, level을 보낸다.|
|GameState|해당 패킷을 받으면 내부의 MonsterData, Position 패킷을 다시 받아서 그걸 분리해야 한다. 즉 이 파일을 받으면 다시 payload를 분리하는 작업이 필요하다.|
|C2SSpawnMonsterRequest|클라이언트 쪽에서 서버 쪽에 몬스터 요청. 아무 것도 안 들어 있다.|
|S2CSpawnMonsterResponse|서버 쪽에서 몬스터가 생성되었을 때 뭐가 생성되었는지, 몇 번째인지 보낸다.|
|S2CSpawnEnemyMonsterNotification|서버 측에서 몬스터의 정보를 보낸다.|

