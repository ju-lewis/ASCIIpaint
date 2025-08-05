
/*================================= GLOBALS ==================================*/
const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const ctx = canvas.getContext("2d");

const fontSize = 24;
const widthToHeightRatio = 0.6;

// Track canvas offsets
var canvasLeftOffset = canvas.getBoundingClientRect().left;
var canvasTopOffset = canvas.getBoundingClientRect().top;
document.addEventListener("resize", () => {
    canvasLeftOffset = canvas.getBoundingClientRect().left;
    canvasTopOffset = canvas.getBoundingClientRect().top;
}); 



/*============================== END OF GLOBALS ==============================*/



class PaintTool {

    isDown: boolean;
    x: number;
    y: number;
    brush: string;
    color: string;

    grid: Array<string>;
    gridCellWidth: number;
    gridCellHeight: number;

    // Define an undo/redo stack
    // Very naive implementation: store a 'snapshot' of the canvas after each brushstroke
    gridHistory: Array<Array<string>> = new Array();
    currentlyUndone: Array<Array<string>> = new Array();


    constructor(grid: Array<string>) {

        this.isDown = false;
        this.x = 0;
        this.y = 0;
        this.brush = "#";
        this.color = "white";

        this.grid = grid;

        this.gridCellHeight = canvas.height / grid.length;
        this.gridCellWidth = this.gridCellHeight * widthToHeightRatio;

        // Register mouse move event
        canvas.addEventListener("mousemove", this.tryPaint);
        canvas.addEventListener("click", this.snapshotGrid);

        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this.isDown = true

            // Handle painting a single 'dot' without needing to move mouse
            this.tryPaint(event);
        });
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

    snapshotGrid = (_event: MouseEvent) => {
        // This gets called after the mouse click is released when painting
        this.gridHistory.push(this.grid);
    }

    setBrush = () => {
        //TODO
        //this.brush = ....
    }


    undo = () => {
        const undoneStroke = this.gridHistory.pop();
    
        // Store the undone change
        if (undoneStroke) {
            this.currentlyUndone.push(undoneStroke);
        }

        renderGrid(this.grid, this.color);
    }
    
    
    redo = () => {
    
    }

};


function initGrid(): Array<string> {

    // Compute height
    const numRows = Math.round(canvas.clientHeight / fontSize);
    let grid = new Array(numRows).fill("");

    return grid;
}

/** 
 * Draws the ASCII art grid to the screen
 */
function renderGrid(grid: Array<string>, color: string): void {
    for (let i=0; i<grid.length; i++) {
        if (ctx) {
            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = color;
            ctx.fillText(grid[i], 0, fontSize*(i+1));
        }
    }
}





// Initialisation code
let grid = initGrid();
const tool = new PaintTool(grid);



