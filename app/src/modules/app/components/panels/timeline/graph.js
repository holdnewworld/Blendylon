// Generated by CoffeeScript 1.12.2
var Graph, Utils;

Utils = require('./utils');

Graph = (function() {
  function Graph(opts) {
    this.defaults = {
      frames: 500,
      distance: 40,
      background: '#313131',
      lineColor: '#4c4c4c',
      lineWidth: 2,
      caption: true,
      font: '10px Verdana',
      fontColor: '#ccc',
      xAxis: true,
      yAxis: false
    };
    this.origin = {
      x: 0,
      y: 0
    };
    this.opts = Utils.merge(this.defaults, opts);
  }

  Graph.prototype.textHalfWidth = function(ctx, text) {
    return ctx.measureText(text).width * .5;
  };

  Graph.prototype.move = function(dx, dy) {
    return this.origin = {
      x: dx,
      y: dy
    };
  };

  Graph.prototype.draw = function(ctx) {
    var i, j, ref, ref1, ref2, ref3, results, x, xPos, y, yPos;
    ctx.fillStyle = this.opts.background;
    ctx.lineWidth = this.opts.lineWidth;
    ctx.strokeStyle = this.opts.lineColor;
    ctx.font = this.opts.font;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (x = i = 0, ref = ctx.canvas.width, ref1 = ~~((this.opts.frames / ctx.canvas.width) * 100); ref1 > 0 ? i <= ref : i >= ref; x = i += ref1) {
      if (this.opts.xAxis) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.origin.x + x + .5, 0);
        ctx.lineTo(this.origin.x + x + .5, ctx.canvas.height);
        ctx.closePath();
        ctx.stroke();
      }
      if (this.opts.caption && this.opts.yAxis) {
        ctx.fillStyle = this.opts.fontColor;
        xPos = this.opts.distance * .5 - this.textHalfWidth(ctx, x);
        yPos = this.origin.y + x + (this.opts.distance * .5 + this.textHalfWidth(ctx, 'y'));
        ctx.fillText(x * 2, xPos, yPos);
      }
    }
    results = [];
    for (y = j = 0, ref2 = ctx.canvas.width, ref3 = ~~((this.opts.frames / ctx.canvas.width) * 100); ref3 > 0 ? j <= ref2 : j >= ref2; y = j += ref3) {
      if (this.opts.yAxis) {
        if (y % this.opts.distance === 0) {
          ctx.lineWidth = this.opts.lineWidth / 3;
        } else {
          ctx.lineWidth = this.opts.lineWidth;
        }
        ctx.beginPath();
        ctx.moveTo(0, this.origin.y + y + .5);
        ctx.lineTo(ctx.canvas.width, this.origin.y + y + .5);
        ctx.closePath();
        ctx.stroke();
      }
      if (this.opts.caption && this.opts.xAxis) {
        ctx.fillStyle = this.opts.fontColor;
        xPos = this.origin.x + y + ((this.opts.distance * .5) - this.textHalfWidth(ctx, y));
        yPos = ctx.canvas.height - 10;
        results.push(ctx.fillText(y, xPos, yPos));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  Graph.prototype.update = function(ctx) {};

  return Graph;

})();

module.exports = Graph;

//# sourceMappingURL=graph.js.map
