window.TP = {};

TP.init = function() {
  this.canvas = document.getElementById('canvas');
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;
  // this.registerToolTips();
  this.registerHandlers();

  // global context properties
  this.ctx.globalCompositeOperation = 'darker';
  this.ctx.globalAlpha = 0.9;

  // keep track of animation
  this.animId = null;

  // keep track of all the shapes on TP
  this.shapeList = [];

  // start animation
  this.animate();
};

// TP.registerToolTips = function() {
//   var self = this;
//   $('.action').tooltip({
//     container: 'body'
//   });
//   $('#download').on('click', function() {
//     $(this).attr('href', self.canvas.toDataURL());
//   });
// };

TP.registerHandlers = function() {
  var self = this;
  this.canvas.onclick = function(e) {
    var square = new TP.Square(e.offsetX, e.offsetY, 40, self.ctx);
    square.render();
    self.shapeList.push(square);
  };
  // $('#pause').on('click', function() {
  //   self.pause();
  // });
  // $('#play').on('click', function() {
  //   self.play();
  // });
};

TP.pause = function() {
  cancelAnimationFrame(this.animId);
  this.animId = null;
};

TP.play = function() {
  var self = this;
  if (!this.animId) {
    this.animId = requestAnimationFrame(function() {
      self.animate();
    });
  }
};

TP.animate = function() {
  var self = this;
  this.render();
  this.animId = requestAnimationFrame(function() {
    self.animate(); // call ourselves, will keep on iterating, rendering the canvas
  });
};

// Clear out the entire canvas and re-render all the shapes
TP.render = function() {
  this.ctx.clearRect(0, 0, this.width, this.height); // clear it out
  for(var index in this.shapeList) {
    this.shapeList[index].animate();
  }
};

TP.Square = function(x, y, size, ctx) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.ctx = ctx;
  this.color = '#' + Math.floor(Math.random()*16777215).toString(16);
  this.xdirection = 'left';
  this.ydirection = 'up';
};

TP.Square.prototype.move = function(newX, newY) {
  this.x = newX;
  this.y = newY;
};

TP.Square.prototype.render = function() {
  this.ctx.beginPath();
  this.ctx.rect(this.x, this.y, this.size, this.size);
  this.ctx.closePath();
  this.ctx.fillStyle = this.color;
  this.ctx.fill();
};

TP.Square.prototype.animate = function() {
  var newPos = this.bounceBack(this.x, this.y, TP.canvas.width, TP.canvas.height);
  this.move(newPos.x, newPos.y);
  this.render();
};

TP.Square.prototype.bounceBack = function(curX, curY, canvasW, canvasH) {

  var newX;
  var newY;

  // top left corner
  if (curX === 0 && curY === 0) {
    this.ydirection = 'down';
    this.xdirection = 'right';
    return {x: curX + 1, y: curY + 1 };
  }

  // top right corner
  if (curX === canvasW && curY === 0) {
    this.ydirection = 'down';
    this.xdirection = 'left';
    return {x: curX - 1, y: curY + 1 };
  }

  // bottom left corner
  if (curX === 0 && curY === canvasH) {
    this.ydirection = 'up';
    this.xdirection = 'right';
    return {x: curX + 1, y: curY - 1 };
  }

  // bottom right corner
  if (curX === canvasW && curY === canvasH) {
    this.ydirection = 'up';
    this.xdirection = 'left';
    return {x: curX - 1, y: curY - 1 };
  }

  // left edge
  if (curX === 0) {
    newX = curX + 1;
    newY = (this.ydirection === 'up') ? curY + 1 : curY - 1;
    this.xdirection = 'right';
    return {x: newX, y: newY};
  }

  // right edge
  if (curX === canvasW) {
    newX = curX - 1;
    newY = (this.ydirection === 'up') ? curY + 1 : curY - 1;
    this.xdirection = 'left';
    return {x: newX, y: newY};
  }

  // top edge
  if (curY === 0) {
    newY = curY + 1;
    newX = (this.xdirection === 'left') ? curX + 1 : curX - 1;
    this.ydirection = 'bottom';
    return {x: newX, y: newY};
  }

  // bottom edge
  if (curY === canvasH) {
    newY = curY - 1;
    newX = (this.xdirection === 'left') ? curX + 1 : curX - 1;
    this.ydirection = 'up';
    return {x: newX, y: newY};
  }

  // anywhere else
  newX = (this.xdirection === 'left') ? curX-1 : curX+1;
  newY = (this.ydirection === 'up') ? curY-1 : curY+1;
  return {x: newX, y: newY};

};

TP.Square.prototype.comeBackTheOtherSide = function(curX, curY, canvasW, canvasH) {
  var newX;
  var newY;
  newX = (curX-1 < 0) ? canvasW : curX-1;
  newY = (curY-1 < 0) ? canvasH : curY-1;
  return {
    x: newX,
    y: newY
  };
};
