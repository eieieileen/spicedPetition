//console.log("sanitycheck");
let isDrawing = false; //when true, moving the mouse draws on the canvas
let x = 0;
let y = 0;

const canvas = $("#canvas");

const ctx = $("#canvas")[0].getContext("2d");

canvas.on("mousedown", (event) => {
    x = event.offsetX;
    y = event.offsetY;
    isDrawing = true;
    console.log("mouse on canvas babyyyy");
});

canvas.on("mousemove", (event) => {
    if (isDrawing === true) {
        drawLine(ctx, x, y, event.offsetX, event.offsetY);
        x = event.offsetX;
        y = event.offsetY;
        console.log("mouse moving myy darling🧏‍♀️");
    }
});

canvas.on("mouseup", (event) => {
    if (isDrawing === true) {
        drawLine(ctx, x, y, event.offsetX, event.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
        console.log("mouseup swaggergirl🧍‍♀️");
    }
});

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    let dataURL = canvas.toDataURL();
    console.log("dit zou het moeten zijn", dataURL);
}

// $("#canvas").on("mousedown", function (){
//     console.log("mousedown");
// });
