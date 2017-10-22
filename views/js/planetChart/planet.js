class Planet {
  constructor(position, radius, speed, parentPosition) {
    this.pos = position;
    this.radius = radius;
    this.speed = speed;
    this.parentPosition = parentPosition;
    this.color = 'white';
  }

  move() {
    this.pos.rotate(this.speed);
  }

  draw(ctx) {
    const pos = this.pos.toCartesian();

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(
      this.parentPosition.x + pos.x,
      this.parentPosition.y + pos.y,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.closePath();
  }
}
