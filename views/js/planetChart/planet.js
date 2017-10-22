/* eslint comma-dangle: ["error", {
      "arrays": "never",
      "objects": "always-multiline",
      "imports": "always",
      "exports": "always",
      "functions": "never"}]
*/
/*
  eslint no-unused-vars: ["error", { "varsIgnorePattern": "Planet" }]
*/

/**
  This class represents a Planet of the PlanetChart plugin.
*/
class Planet {
  /**
    Constructor.
    position: PolarVector representing the planet position from it parentPosition
    radius: the radius of the planet
    speed: the rotation speed
    parentPosition: the parent CartesianVector position object
  */
  constructor(position, radius, speed, parentPosition) {
    this.pos = position;
    this.radius = radius;
    this.speed = speed;
    this.parentPosition = parentPosition;
    this.color = 'white';
  }

  /**
    Move the planet.
  */
  move() {
    this.pos.rotate(this.speed);
  }

  /**
    Draw the planet
  */
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
