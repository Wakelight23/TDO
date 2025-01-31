export const generateRandomMonsterPath = (startY) => {
  const path = [];
  let currentX = 20;
  let currentY = startY; //

  path.push({ x: currentX, y: currentY });

  while (currentX < 1400) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > 1400) {
      currentX = 1400;
    }
    currentY += Math.floor(Math.random() * 121) - 60; // -60 ~ 60 범위로 Y 변경
    // Y 값 클램프 처리
    if (currentY < startY - 100) {
      currentY = startY - 100;
    }
    if (currentY > startY + 100) {
      currentY = startY + 100;
    }

    path.push({ x: currentX, y: currentY });
  }

  path[path.length - 1].y = startY;
  return path;
};

//마지막 포인트를 가져옵니다.
export const getLastPathPoint = (path) => {
  if (path.length === 0) {
    console.error('경로를 넣으라고');
  }
  return path[path.length - 1];
};

//이건 혹시 몬스터 패스의 Y를 전체적으로 올려야 할때 사용하려고 했던것. 지워도 됨.
export const adjustPathY = (path, offsetY) => {
  return path.map((point) => ({
    x: point.x,
    y: point.y + offsetY,
  }));
};
