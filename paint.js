var canvas = document.getElementById("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext("2d");
var fontSize = 24;
var widthToHeightRatio = 0.62;
var PaintTool = /** @class */ (function () {
    function PaintTool(grid) {
        var _this = this;
        this.tryPaint = function (event) {
            if (_this.isDown) {
                // Localise to the relevant grid cell
                var xIdx = Math.round((event.clientX - canvas.clientLeft) / _this.gridCellWidth);
                var yIdx = Math.round((event.clientY - canvas.clientTop) / _this.gridCellHeight);
                // Check if we need to increase the length of the string to account for new character coord
                if (_this.grid[yIdx].length <= xIdx) {
                    // Extend the row to the required length
                    _this.grid[yIdx] += " ".repeat(xIdx - _this.grid[yIdx].length + 1);
                }
                // 'Paint' specified cell
                _this.grid[yIdx] = _this.grid[yIdx].slice(0, xIdx) + _this.brush + _this.grid[yIdx].slice(xIdx + 1, _this.grid[yIdx].length);
                renderGrid(_this.grid);
            }
        };
        this.isDown = false;
        this.x = 0;
        this.y = 0;
        this.brush = "#";
        this.grid = grid;
        this.gridCellHeight = canvas.height / grid.length;
        this.gridCellWidth = this.gridCellHeight * widthToHeightRatio;
        // Register mouse move event
        canvas.addEventListener("mousemove", this.tryPaint);
        canvas.addEventListener("mousedown", function () { _this.isDown = true; });
        canvas.addEventListener("mouseup", function () { _this.isDown = false; });
    }
    return PaintTool;
}());
;
function initGrid() {
    // Compute height
    var numRows = Math.round(canvas.clientHeight / fontSize);
    var grid = new Array(numRows);
    return grid.fill("");
}
function renderGrid(grid) {
    console.log(grid);
    for (var i = 0; i < grid.length; i++) {
        if (ctx) {
            ctx.font = "".concat(fontSize, "px monospace");
            ctx.fillStyle = "white";
            ctx.fillText(grid[i], 0, fontSize * (i + 1));
        }
    }
}
// Initialisation code
var grid = initGrid();
new PaintTool(grid);
