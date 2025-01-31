# Tower Defense Online

## WireFrame & ERD

<details> 
<summary>WireFrame</summary>

</details>

<details> 
<summary>ERD</summary>

</details>

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
