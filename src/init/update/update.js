import { getAllGameSessions } from "../../session/game.session.js";

//이 파일에선 frame에 따라서 데이터를 보낼 수 있도록 해보자.
const targetFPS = 60;
const minFPS = 30;

const targetFrameDuration = 1000 / targetFPS;
const minFrameDuration = 1000 / minFPS;

let lastUpdateTime = Date.now();

export const updateList = [];

//별도의 처리를 할 업데이트가 있다면 추가해 보도록 하자.

function update() {
    const gameSessions = getAllGameSessions();
    //델타 타임을 확인해 보도록 하자
    const now = Date.now();
    const deltaTime = now - lastUpdateTime;
    lastUpdateTime = now;
    for (let gameSession of gameSessions) {
        //2부터 게임이 시작된다고 했으니 그 때부터 보내면 될 듯 하다.
        //너무 빠르게 시작했을 때 게임이 시작하기도 전에 동기화 패킷을 보내면서 문제가 발생하는 문제가 있다. 
        //제대로 게임이 실행되기까지 대기할 수 있도록 해야 한다.
        if (gameSession.state === 'inProgress') {
            
            //console.log("업데이트 되는 중");
            gameSession.updateTimestamp(deltaTime);
        }
    }
    //여기서 프레임마다 업데이트를 해보도록 하자.
}

//여기에서 나중에 별도의 업데이트가 필요한 게 있다면 추가하도록 하자.
//나중에 변경될 수도 있으니 생각해 보자.
//나중에 match가 되었을 때 이걸 붙여 넣으면 되지 않을까 싶다.
export function updateLoop() {

    //게임 내 데이터의 동기화는 차라리 좀 딜레이 있게 해보도록 할까?
    //이 쪽은 동기화 업데이트의 경우
    setInterval(() => {
        //console.log("업데이트 확인용")
        update();

    }, 1000);//1초마다 실행되도록 만들었다.
    //시간에 따라서 업데이트를 세분화 할 수 있는지 고민해보자.
}
