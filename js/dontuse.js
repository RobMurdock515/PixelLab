
  /* =========================================================================================================================================== */
/*                                                Good Spray code?                                                            */
/* =========================================================================================================================================== */

function drawBrushPattern(row, col, brushSize, pressure, angle) {
  const brushPattern = [];
  const radius = brushSize / 2;

  // Generate random positions with varying density
  for (let i = 0; i < Math.floor(brushSize * brushSize * pressure * 1.5); i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    brushPattern.push([dx, dy]);
  }

  brushPattern.forEach(([dx, dy]) => {
    const x = col * cellSize + dx * cellSize * Math.cos(angle) - dy * cellSize * Math.sin(angle);
    const y = row * cellSize + dx * cellSize * Math.sin(angle) + dy * cellSize * Math.cos(angle);

    const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
    const alpha = pressure * (1 - distanceToCenter / radius) * 0.8; // Adjust alpha for fade-out

    ctx.globalAlpha = alpha;
    ctx.fillRect(x, y, cellSize, cellSize);
  });

  ctx.globalAlpha = 1; // Reset global alpha
}