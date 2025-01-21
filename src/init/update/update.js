import { getAllGameSessions } from "../../session/game.session.js";

//이 파일에선 frame에 따라서 데이터를 보낼 수 있도록 해보자.
const targetFPS = 60;
const minFPS = 30;

const targetFrameDuration = 1000 / targetFPS;
const minFrameDuration = 1000/minFPS;

let lastUpdateTime = Date.now();

function update(deltaTime)
{
    const gameSessions = getAllGameSessions();
    for(let gameSession of gameSessions)
    {
        gameSession.updateTimestamp(deltaTime);
    }
    //여기서 프레임마다 업데이트를 해보도록 하자.
}

//여기에서 나중에 별도의 업데이트가 필요한 게 있다면 추가하도록 하자.
//나중에 변경될 수도 있으니 생각해 보자.
function updateLoop()
{
    const now = Date.now();
    const deltaTime = now - lastUpdateTime;

    if(targetFrameDuration >= deltaTime && deltaTime >= minFrameDuration)
    {
        //나중에 별도의 이벤트가 추가되어야 한다면 여기서 처리해 주도록 하자.
        update(deltaTime);
        lastUpdateTime = now;
    }

    requestAnimationFrame(updateLoop);
}

updateLoop();
