/**
  PlanetChart is a class that allows a user to display data
  as a solar system visualisation.

  A PlanetChart object displays data as planets orbiting around an origin
  (it can be seen as the sun).
  Each planet has its own size (radius), own distance to the origin, own speed
  and color that can be provided to represent any kind of data.

  For example, if you want to compare six cars pros and cons and focus on
  specific features such as their size, their speed and their date of production,
  you could map each planet size to one of the car size, each planet speed to
  one of the car speed, and each planet distance to the orgin to one of the car
  date of production. It could allow you to quickly compare these three features
  in an other way than a bar graph...
*/
class PlanetChart {

  /**
    Constructor to build a PlanetChart object. Each PlanetChart object must be
    at least be given a HTML5 canvas ID to work with.

    You can pass the data you want to compare as an array of objects containing
    at least the properties 'size', 'distance' and 'speed' that will respectively
    match to the planets radius, distance to the origin and speed of rotation
    properties.
  */
  constructor(options) {
    // Default plugin options definition
    const defaultOptions = {
      canvasID: undefined,
      data: undefined,
      position: {
        x: 0.5,
        y: 0.5,
      },
      resizable: false, // If the graph should be resizable
      icon: undefined, // Image object to represent the sun (white circle by default)
    };

    // Merge and save the plugin options
    this.options = Object.assign({}, defaultOptions, options);

    // Canvas object
    this.c = document.getElementById(this.options.canvasID);
    // Canvas context
    this.ctx = this.c.getContext("2d");

    // Constants
    this.computeConstraints();


    // Set up the position of the target
    this.pos = new CartesianVector(
      this.options.position.x * this.c.width,
      this.options.position.y * this.c.height
    );

    // Create the planets
    this.planets = [];

    // generate the planets
    this.generatePlanets();

    // Place the planet at different angles
    const data = this.options.data;

    // interval variable
    this.heart = 0;

    // Counter
    this.counter = 0;
  }

  /**
    Compute the constraints that are needed to keep the visualisation
    inside the HTML5 canvas bounds.
  */
  computeConstraints() {
    // Constants
    this.RADIUS = 30; // The radius of the main sun
    this.ICON_RATIO = 0.9; // The icon size in %
    // The maximum space to draw things
    this.AVAILABLE_SPACE = Math.min(this.c.width / 2, this.c.height / 2);
    // Min and max speed of planets
    this.MIN_SPEED = Math.PI / 128;
    this.MAX_SPEED = Math.PI / 64;
    // Min and max radius of planets
    this.MIN_RADIUS = 5;
    this.MAX_RADIUS = this.RADIUS / 1.5;
    // Min and max distance of the planets from the center
    this.MIN_DISTANCE = this.RADIUS + this.MAX_RADIUS + 5;
    this.MAX_DISTANCE = this.AVAILABLE_SPACE - this.MAX_RADIUS - 5;
  }

  /**
    Fill the array of planets according to the 'data' options field provided
    in the constructor.
  */
  generatePlanets() {
    // Get the data array from options
    const data = this.options.data;

    // Create arrays of value
    this.retrieveValuesInArrays();

    // Compute the min/max values of each property
    this.computeMinMaxValues();

    // Create each planet
    const DELTA_ANGLE = 2 * Math.PI / data.length;
    for (let i = 0; i < data.length; ++i) {

      this.planets.push(
        new Planet(
          new PolarVector(
            DELTA_ANGLE * i,
            this.scaleDistance(data[i].distance)
          ),
          this.scaleSize(data[i].size),
          this.scaleSpeed(data[i].speed),
          this.pos
        )
      );

      // Set the color if provided
      if (this.planets[i].color != undefined) {
        this.planets[i].color = data[i].color;
      }
    }
  }

  /**
    Extract values from the array of data objects in order to
    work with raw data easily.
  */
  retrieveValuesInArrays() {
    const data = this.options.data;
    // Retrieve all values in separate arrays
    this.distances = [];
    this.sizes = [];
    this.speeds = [];
    for (let i = 0; i < data.length; ++i) {
      this.distances.push(data[i].distance);
      this.sizes.push(data[i].size);
      this.speeds.push(data[i].speed);
    }
  }

  /**
    Compute the min/max value of each property ('size', 'distance', 'speed')
    provided in the constructor.
  */
  computeMinMaxValues() {
    const data = this.options.data;
    // Get min/max value of each property
    this.minDistance = Math.min.apply(null, this.distances);
    this.maxDistance = Math.max.apply(null, this.distances);

    this.minSize = Math.min.apply(null, this.sizes);
    this.maxSize = Math.max.apply(null, this.sizes);

    this.minSpeed = Math.min.apply(null, this.speeds);
    this.maxSpeed = Math.max.apply(null, this.speeds);
  }

  /**
    Update the planets size, distance to the origin and speed to match
    the constraints.
  */
  updatePlanets() {
    const data = this.options.data;

    for (let i = 0; i < this.planets.length; ++i) {
      this.planets[i].pos.radius = this.scaleDistance(data[i].distance);
      this.planets[i].radius = this.scaleSize(data[i].size);
      this.planets[i].speed = this.scaleSpeed(data[i].speed);
    }
  }

  /**
    Scale a distance value to the constraints range.
  */
  scaleDistance(distance) {
    return this.scaleProperty(
      distance,
      this.minDistance,
      this.maxDistance,
      this.MIN_DISTANCE,
      this.MAX_DISTANCE
    );
  }

  /**
    Scale a size value to the constraints range.
  */
  scaleSize(size) {
    return this.scaleProperty(
      size,
      this.minSize,
      this.maxSize,
      this.MIN_RADIUS,
      this.MAX_RADIUS
    );
  }

  /**
    Scale a speed value to the constraints range.
  */
  scaleSpeed(speed) {
    return this.scaleProperty(
      speed,
      this.minSpeed,
      this.maxSpeed,
      this.MIN_SPEED,
      this.MAX_SPEED
    );
  }

  /**
    Scale a property inside a given real range to a target range.

    If the real range is of width 0, it returns the mean of targetA and targetB.
  */
  scaleProperty(val, realA, realB, targetA, targetB) {
    const realDistance = realB - realA;
    const targetDistance = targetB - targetA;
    const valDiff = val - realA;

    if (realDistance === 0) {
      return (targetB + targetA) / 2
    }

    return targetA + valDiff * (targetDistance / realDistance);
  }

  /**
    Start the visualisation.
  */
  start() {
    const self = this;
    this.heart = setInterval(
      function () {
        self.move();
        self.draw();
      },
      1000 / 25
    );
  }

  /**
    Pause the visualisation
  */
  pause() {
    clearInterval(this.heart);
  }

  /**
    Move the planets. Called by the interval function started in start method.
  */
  move() {
    // update constraints and planets properties if asked by the user
    if (this.options.resizable === true) {
      if (++this.counter >= 25) {
        // The position of the origin
        this.pos.x = this.c.width * this.options.position.x;
        this.pos.y = this.c.height * this.options.position.y;

        // Compute constraints
        this.computeConstraints();

        // Update planets properties
        this.updatePlanets();
        this.counter = 0;
      }
    }

    // Move planets
    for (let i = 0; i < this.planets.length; ++i) {
      this.planets[i].move();
    }
  }

  /**
    Draw the planets. Called by the interval function started in start method.
  */
  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);

    // Draw Sun
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.RADIUS, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();

    if (this.options.icon != undefined) {
      this.ctx.drawImage(
        this.options.icon,
        this.pos.x - this.RADIUS * this.ICON_RATIO,
        this.pos.y - this.RADIUS * this.ICON_RATIO,
        this.RADIUS * 2 * this.ICON_RATIO,
        this.RADIUS * 2 * this.ICON_RATIO
      );
    }
    this.ctx.closePath();

    // Draw orbits
    for (let i = 0; i < this.planets.length; ++i) {
      this.ctx.beginPath();
      this.ctx.arc(this.pos.x, this.pos.y, this.planets[i].pos.radius, 0, 2 * Math.PI, false);
      this.ctx.strokeStyle = this.planets[i].color;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      this.ctx.arc(this.pos.x, this.pos.y, this.planets[i].pos.radius, 0, 2 * Math.PI, false);
      this.ctx.closePath();
    }

    // Draw planets
    for (let i = 0; i < this.planets.length; ++i) {
      this.planets[i].draw(this.ctx);
    }
  }
}
