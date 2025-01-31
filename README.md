# Tower Defense Online

## GamePlay Video

## Introduce

## WireFrame & ERD

<details> 
<summary>WireFrame</summary>

</details>

<details> 
<summary>ERD</summary>

</details>

## How to play

- [MacOS]()
- [WinOS]()

## File Directory

```
📦src
 ┣ 📂classes
 ┃ ┗ 📂models
 ┃ ┃ ┣ 📜game.class.js
 ┃ ┃ ┣ 📜matchmaking.class.js
 ┃ ┃ ┣ 📜monster.class.js
 ┃ ┃ ┗ 📜user.class.js
 ┣ 📂config
 ┃ ┗ 📜config.js
 ┣ 📂constants
 ┃ ┣ 📜env.js
 ┃ ┣ 📜handlerIds.js
 ┃ ┗ 📜header.js
 ┣ 📂db
 ┃ ┣ 📂sql
 ┃ ┃ ┗ 📜user_db.sql
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜user.db.js
 ┃ ┃ ┗ 📜user.queries.js
 ┃ ┗ 📜database.js
 ┣ 📂events
 ┃ ┣ 📜onConnection.js
 ┃ ┣ 📜onData.js
 ┃ ┣ 📜onEnd.js
 ┃ ┗ 📜onError.js
 ┣ 📂handlers
 ┃ ┣ 📂game
 ┃ ┃ ┗ 📜gameEnd.handler.js
 ┃ ┣ 📂matching
 ┃ ┃ ┗ 📜match.handler.js
 ┃ ┣ 📂monster
 ┃ ┃ ┣ 📜monsterAttackBase.handler.js
 ┃ ┃ ┣ 📜monsterDeathNotification.handler.js
 ┃ ┃ ┣ 📜spawnMonster.handler.js
 ┃ ┃ ┗ 📜spawnMonsterNotification.js
 ┃ ┣ 📂tower
 ┃ ┃ ┣ 📜towerAttack.handler.js
 ┃ ┃ ┗ 📜towerPurchase.handler.js
 ┃ ┣ 📂user
 ┃ ┃ ┗ 📜register.handler.js
 ┃ ┗ 📜index.js
 ┣ 📂init
 ┃ ┣ 📂update
 ┃ ┃ ┗ 📜update.js
 ┃ ┣ 📜assets.js
 ┃ ┣ 📜index.js
 ┃ ┗ 📜loadProtos.js
 ┣ 📂protobuf
 ┃ ┣ 📂fail
 ┃ ┃ ┗ 📜fail.proto
 ┃ ┣ 📂notification
 ┃ ┃ ┗ 📜game.notification.proto
 ┃ ┣ 📂request
 ┃ ┃ ┗ 📜packets.proto
 ┃ ┗ 📜packetNames.js
 ┣ 📂session
 ┃ ┣ 📜game.session.js
 ┃ ┣ 📜sessions.js
 ┃ ┗ 📜user.session.js
 ┣ 📂utils
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜customError.js
 ┃ ┃ ┣ 📜errorCodes.js
 ┃ ┃ ┗ 📜errorHandler.js
 ┃ ┣ 📂monster
 ┃ ┃ ┗ 📜monsterPath.js
 ┃ ┣ 📂parser
 ┃ ┃ ┣ 📜customPacketParser.js
 ┃ ┃ ┗ 📜packetParser.js
 ┃ ┣ 📂response
 ┃ ┃ ┗ 📜createResponse.js
 ┃ ┣ 📜dateFormatter.js
 ┃ ┗ 📜transformCase.js
 ┗ 📜server.js
```

## 구현 기능

<details> 
<summary>로그인/회원가입</summary>

- 회원가입

  - 회원가입 시 중복 이메일 검증
  - 이메일 형식 검증
  - 중복 아이디 검증

- 로그인
  - 회원가입 시 생성된 uuid로 중복 로그인 검증
  - 마지막 로그인 시간 저장
  - 비밀번호 검증

</details>

<details> 
<summary>게임 방 생성 및 매치</summary>

- 매치메이킹 큐 시스템 구현

  - 대기열 기반 매치메이킹 시스템 구현
  - 점수 기반 매칭 로직 (초기 매칭 범위 존재)
  - 대기 시간에 따른 매칭 범위 확장 구현
  - 중복 매칭 방지 로직 추가

- 매치메이킹 핸들러 구현

  - 매칭 요청/취소 처리
  - 이미 게임 중인 유저 체크
  - 대기열 추가/제거 로직

- 매칭 해제 및 정리
  - 클라이언트 연결 종료 시 매칭 큐에서 제거

</details>

<details> 
<summary>몬스터 스폰 및 이동, 공격</summary>

- Monster 처치 시 score 및 gold 획득

  - 타워 종류, 레벨에 따라 score, gold 획득 차등화

- 레벨 디자인
  - 1 ~ 5 까지 일반 stage
  - 6 stage 부터 보스 stages

</details>

<details> 
<summary>타워 초기 설치, 구매, 공격</summary>

- 타워 구매시 정해진 확률에 따라 타워 종류가 결정

- 타워 공격시 User가 가지고 있는 타워인지 검증

</details>

<details> 
<summary>게임 오버(게임 종료), 클라이언트 연결 끊김 처리</summary>

- 게임 오버(게임 종료)

  - 게임 플레이를 완료 후 Base의 체력이 먼저 0이 된 User가 패배,
    Base의 체력이 Base > 0 인 User에게 승리 판정
  - GameOver 관련 Packet 전송
  - 게임이 종료될 때 User 클래스에 정의된 현재 score를 highscore로 변환
  - 게임이 종료될 때 DB와 연동하여 highscore를 저장
  - 만약 현재 저장된 highscore보다 score가 낮다면 갱신되지 않음,
    현재 저장된 highscore보다 score가 높다면 DB에 저장된 highscore를 갱신
    ```Javascript
    if (user.score > user.highscore) {
        console.log(`신기록 달성! : ${user.score}`);
        // DB에 새로운 highScore 업데이트
        await updateDBHighScore(user.id, user.score);
        // 메모리 상의 사용자 highScore도 업데이트
        user.highscore = user.score;
      }
    ```

- 클라이언트 연결 끊김 처리
  - 게임 플레이 도중에 클라이언트의 연결이 끊어졌을 때, 이미 게임 중인 다른 플레이어는 상대 유저에게 더 이상 동기화 데이터를 받지 않을 때 승리 판정으로 게임 종료
  - 게임 방이 남아있으면 메모리 사용량이 증가함으로 User가 gameSession에 들어가 있지 않다면 삭제

</details>

<details> 
<summary>서버 ↔ 클라이언트 동기화 작업</summary>

</details>

## 기술 스택

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"><img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"><img src="https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white"><img src="https://img.shields.io/badge/.env-0D47A1?style=for-the-badge&logo=.env&logoColor=white">
