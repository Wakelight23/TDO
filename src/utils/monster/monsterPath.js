export const generateRandomMonsterPath = (startY) => {
  const path = [];
  let currentX = 0;
  let currentY = startY; // 500 ~ 520 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < 1400) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > 1400) {
      currentX = 1400;
    }
    //currentY += Math.floor(Math.random() * 40) - 20; // -20 ~ 20 범위로 Y 변경
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
}

export const getLastPathPoint = (path) => {
  if (path.length === 0) {
    console.error("경로를 넣으라고");
  }
  return path[path.length - 1];
};

export const adjustPathY = (path, offsetY) => {
  return path.map(point => ({
    x: point.x,
    y: point.y + offsetY
  }));
};