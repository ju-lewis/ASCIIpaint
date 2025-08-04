
const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const ctx = canvas.getContext("2d");

const fontSize = 24;
const widthToHeightRatio = 0.6;


// Track canvas offsets
var canvasLeftOffset = canvas.getBoundingClientRect().left;
var canvasTopOffset = canvas.getBoundingClientRect().top;


class PaintTool {

    isDown: boolean;
    x: number;
    y: number;
    brush: string;

    grid: Array<string>;
    gridCellWidth: number;
    gridCellHeight: number;

    constructor(grid: Array<string>) {

        this.isDown = false;
        this.x = 0;
        this.y = 0;
        this.brush = "#";

        this.grid = grid;

        this.gridCellHeight = canvas.height / grid.length;
        this.gridCellWidth = this.gridCellHeight * widthToHeightRatio;

        // Register mouse move event
        canvas.addEventListener("mousemove", this.tryPaint);
        canvas.addEventListener("mousedown", () => {this.isDown = true});
        canvas.addEventListener("mouseup", () => {this.isDown = false});
    }

    tryPaint = (event: MouseEvent) => {
        if (this.isDown) {

            // Localise to the relevant 'grid cell'
            const xIdx = Math.round((event.clientX - canvasLeftOffset) / this.gridCellWidth);
            const yIdx = Math.round((event.clientY - canvasTopOffset) / this.gridCellHeight);

            // Check if we need to increase the length of the string to account for new character coord
            if (this.grid[yIdx].length <= xIdx) {
                // Extend the row to the required length
                this.grid[yIdx] += " ".repeat(xIdx - this.grid[yIdx].length + 1);
            }

            // 'Paint' specified cell
            this.grid[yIdx] = this.grid[yIdx].slice(0, xIdx) + this.brush + this.grid[yIdx].slice(xIdx + 1, this.grid[yIdx].length);

            renderGrid(this.grid, "white");
        }
    }

    setBrush = () => {
        //TODO
        //this.brush = ....
    }
};


function initGrid(): Array<string> {

    // Compute height
    const numRows = Math.round(canvas.clientHeight / fontSize);
    let grid = new Array(numRows);
    
    return grid.fill("");
}



function renderGrid(grid: Array<string>, colour: string): void {

    for (let i=0; i<grid.length; i++) {

        if (ctx) {
            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = colour;
            ctx.fillText(grid[i], 0, fontSize*(i+1));
        }
    }

}


// Initialisation code
let grid = initGrid();
new PaintTool(grid);





