

export const buttonImagesCreator = (buttons, ctx, style) => {
  const width = parseFloat(style.width);

  const buttonsImgData = {};
  for (let button in buttons) {
    buttonsImgData[button] = { normal: null, highlight: null, select: null };
  }

  function rectangleImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, 30, 30);
    /// fill the gap between buttonsImgData (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(30, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.strokeRect(5, 5, 20, 20);
  }


  rectangleImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.rectangle.normal = ctx.getImageData(0, 0, 32, 30);
  rectangleImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttonsImgData.rectangle.highlight = ctx.getImageData(0, 0, 32, 30);
  rectangleImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.rectangle.select = ctx.getImageData(0, 0, 32, 30);


  function circleImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(32, 0, 30, 30);
    /// fill the gap between buttonsImgData (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(62, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.arc(47, 15, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
  }

  circleImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.circle.normal = ctx.getImageData(32, 0, 32, 30);
  circleImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttonsImgData.circle.highlight = ctx.getImageData(32, 0, 32, 30);
  circleImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.circle.select = ctx.getImageData(32, 0, 32, 30);

  function lineImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(64, 0, 30, 30);
    /// fill the gap between buttonsImgData (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(94, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(69, 5);
    ctx.lineTo(89, 25);
    ctx.stroke();
    ctx.beginPath();
  }

  lineImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.line.normal = ctx.getImageData(64, 0, 32, 30);
  lineImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttonsImgData.line.highlight = ctx.getImageData(64, 0, 32, 30);
  lineImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.line.select = ctx.getImageData(64, 0, 32, 30);

  function pencilImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(96, 0, 30, 30);

    /// fill the gap between buttonsImgData (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(126, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(101, 13);
    ctx.lineTo(117, 13);
    ctx.lineTo(121, 15);
    ctx.lineTo(117, 17);
    ctx.lineTo(101, 17);
    ctx.lineTo(101, 13);

    ctx.moveTo(117, 13);
    ctx.lineTo(117, 17);

    ctx.moveTo(104, 13);
    ctx.lineTo(104, 17);
    ctx.stroke();
    ctx.beginPath();
  }

  pencilImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.pencil.normal = ctx.getImageData(96, 0, 32, 30);
  pencilImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttonsImgData.pencil.highlight = ctx.getImageData(96, 0, 32, 30);
  pencilImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.pencil.select = ctx.getImageData(96, 0, 32, 30);

  function colorImage({ bgcolor, iconcolor, color }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(128, 0, 30, 30);
    ctx.fillStyle = color;
    ctx.fillRect(133, 5, 20, 20);
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(133, 5);
    ctx.lineTo(153, 5);
    ctx.lineTo(153, 25);
    ctx.lineTo(133, 25);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
  }

  colorImage({ bgcolor: "lightgrey", iconcolor: "black", color: "black" })
  buttonsImgData.color.normal = ctx.getImageData(128, 0, 30, 30);
  colorImage({ bgcolor: "lightgrey", iconcolor: "white", color: "black" })
  buttonsImgData.color.highlight = ctx.getImageData(128, 0, 30, 30);
  colorImage({ bgcolor: "darkgrey", iconcolor: "black", color: "black" })
  buttonsImgData.color.select = ctx.getImageData(128, 0, 30, 30);

  function xImage({ bgcolor, iconcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(width - 30, 0, 30, 30);
    ctx.font = "20px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = iconcolor;
    ctx.fillText("x", width - 15, 15);
  }
  xImage({ bgcolor: "lightgrey", iconcolor: "black" })
  buttonsImgData.x.normal = ctx.getImageData(width - 30, 0, 30, 30);
  xImage({ bgcolor: "lightgrey", iconcolor: "white" })
  buttonsImgData.x.highlight = ctx.getImageData(width - 30, 0, 30, 30);
  xImage({ bgcolor: "darkgrey", iconcolor: "black" })
  buttonsImgData.x.select = ctx.getImageData(width - 30, 0, 30, 30);


  function redoImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(width - 62, 0, 30, 30);

    /// fill the gap between buttonsImgData (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(width - 32, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(width - 37, 10);
    ctx.lineTo(width - 57, 10);
    ctx.lineTo(width - 57, 20);
    ctx.lineTo(width - 47, 20);
    ctx.moveTo(width - 37, 10);
    ctx.lineTo(width - 42, 5);
    ctx.moveTo(width - 37, 10);
    ctx.lineTo(width - 42, 15);

    ctx.stroke();
    ctx.beginPath();
  }

  redoImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.redo.normal = ctx.getImageData(width - 62, 0, 32, 30);
  redoImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttonsImgData.redo.highlight = ctx.getImageData(width - 62, 0, 32, 30);
  redoImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.redo.select = ctx.getImageData(width - 62, 0, 32, 30);

  function undoImage({ bgcolor, iconcolor, gapcolor }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(width - 94, 0, 30, 30);

    /// fill the gap between buttonsImgData (just visual)
    ctx.fillStyle = gapcolor;
    ctx.fillRect(width - 64, 0, 2, 30);
    ///
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(width - 89, 10);
    ctx.lineTo(width - 69, 10);
    ctx.lineTo(width - 69, 20);
    ctx.lineTo(width - 79, 20);
    ctx.moveTo(width - 89, 10);
    ctx.lineTo(width - 84, 5);
    ctx.moveTo(width - 89, 10);
    ctx.lineTo(width - 84, 15);

    ctx.stroke();
    ctx.beginPath();
  }

  undoImage({ bgcolor: "lightgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.undo.normal = ctx.getImageData(width - 94, 0, 32, 30);
  undoImage({ bgcolor: "lightgrey", iconcolor: "white", gapcolor: "white" })
  buttonsImgData.undo.highlight = ctx.getImageData(width - 94, 0, 32, 30);
  undoImage({ bgcolor: "darkgrey", iconcolor: "black", gapcolor: "white" })
  buttonsImgData.undo.select = ctx.getImageData(width - 94, 0, 32, 30);


  return buttonsImgData;
}

export const colorPaletteImagesCreator = (ctx, colors) => {
  // color = ["black", "red", "green", "blue", "orange" ]; when i select 1rst index ie; "red", then sub it to 0th and sub the 0th to the 1rst
  // = color palette 

  let colorPaletteImgData = {};

  function colorImage({ bgcolor, iconcolor, color }) {
    ctx.fillStyle = bgcolor;
    ctx.fillRect(128, 0, 30, 30);
    ctx.fillStyle = color;
    ctx.fillRect(133, 5, 20, 20);
    ctx.lineWidth = 1;
    ctx.strokeStyle = iconcolor;
    ctx.beginPath();
    ctx.moveTo(133, 5);
    ctx.lineTo(153, 5);
    ctx.lineTo(153, 25);
    ctx.lineTo(133, 25);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
  }

  for (let color of colors) {
    colorPaletteImgData[color] = { normal: null, highlight: null, select: null };

    colorImage({ bgcolor: "lightgrey", iconcolor: "black", color: color })
    colorPaletteImgData[color].normal = ctx.getImageData(128, 0, 30, 30);
    colorImage({ bgcolor: "lightgrey", iconcolor: "white", color: color })
    colorPaletteImgData[color].highlight = ctx.getImageData(128, 0, 30, 30);
    colorImage({ bgcolor: "darkgrey", iconcolor: "black", color: color })
    colorPaletteImgData[color].select = ctx.getImageData(128, 0, 30, 30);
  }

  return colorPaletteImgData;

}

export const colorPaletteRender = (ctx, colors, colorPaletteCoords, colorPaletteImgData, highlightedColorIndex = null) => {
  // we have implicit positioning - as colors is an Array -> in order of color palette presentation in the canvas

  // This is for palette (full colors spread out) only. 
  // case 0 : All of the colors are normal
  // case 1 : One of the colors in palette can have white border when pressed
  // that's it
  //
  //Selected color is in the first position
  for (let i = 0; i < colors.length; i++) {
    if (i === highlightedColorIndex) {
      ctx.putImageData(colorPaletteImgData[colors[i]].highlight, colorPaletteCoords[i][0], colorPaletteCoords[i][1]);
    } else if (i === 0) {
      ctx.putImageData(colorPaletteImgData[colors[i]].select, colorPaletteCoords[i][0], colorPaletteCoords[i][1]);
    } else {
      ctx.putImageData(colorPaletteImgData[colors[i]].normal, colorPaletteCoords[i][0], colorPaletteCoords[i][1]);
    }
  }

}


export const buttonRender = (ctx, style, buttonsImgData, { normal = false, highlight = false, select = false },
  colorPaletteImgData, color = null, shape = "all") => { // color = first element in the colors array (because the first element is always the selected one)

  const width = parseFloat(style.width);

  if (shape === "rectangle" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttonsImgData.rectangle.normal, 0, 0);
    } else if (highlight) {
      ctx.putImageData(buttonsImgData.rectangle.highlight, 0, 0);
    } else if (select) {
      ctx.putImageData(buttonsImgData.rectangle.select, 0, 0);
    }
  }

  if (shape === "circle" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttonsImgData.circle.normal, 32, 0);
    } else if (highlight) {
      ctx.putImageData(buttonsImgData.circle.highlight, 32, 0);
    } else if (select) {
      ctx.putImageData(buttonsImgData.circle.select, 32, 0);
    }
  }

  if (shape === "line" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttonsImgData.line.normal, 64, 0);
    } else if (highlight) {
      ctx.putImageData(buttonsImgData.line.highlight, 64, 0);
    } else if (select) {
      ctx.putImageData(buttonsImgData.line.select, 64, 0);
    }
  }

  if (shape === "pencil" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttonsImgData.pencil.normal, 96, 0);
    } else if (highlight) {
      ctx.putImageData(buttonsImgData.pencil.highlight, 96, 0);
    } else if (select) {
      ctx.putImageData(buttonsImgData.pencil.select, 96, 0);
    }
  }

  if (shape === "color" || shape === "all") {
    if (normal) {
      ctx.putImageData(colorPaletteImgData[color].normal, 128, 0);
    } else if (highlight) {
      ctx.putImageData(colorPaletteImgData[color].highlight, 128, 0);
    } else if (select) {
      ctx.putImageData(colorPaletteImgData[color].select, 128, 0);
    }
  }

  if (shape === "x" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttonsImgData.x.normal, width - 30, 0);
    } else if (highlight) {
      ctx.putImageData(buttonsImgData.x.highlight, width - 30, 0);
    } else if (select) {
      ctx.putImageData(buttonsImgData.x.select, width - 30, 0);
    }
  }

  if (shape === "redo" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttonsImgData.redo.normal, width - 62, 0);
    } else if (highlight) {
      ctx.putImageData(buttonsImgData.redo.highlight, width - 62, 0);
    } else if (select) {
      ctx.putImageData(buttonsImgData.redo.select, width - 62, 0);
    }
  }

  if (shape === "undo" || shape === "all") {
    if (normal) {
      ctx.putImageData(buttonsImgData.undo.normal, width - 94, 0);
    } else if (highlight) {
      ctx.putImageData(buttonsImgData.undo.highlight, width - 94, 0);
    } else if (select) {
      ctx.putImageData(buttonsImgData.undo.select, width - 94, 0);
    }
  }
}




export const isInsideButtonRegion = ({ x0, x1, y0, y1 }, { offsetX, offsetY }) => {
  // Gave offsetX < x1 instead of <= because if the user hits the center line between two colors, then he will select the color to the left
  if (offsetX >= x0 && offsetX < x1 && offsetY >= y0 && offsetY <= y1) {
    return true;
  }
  return false;
}

export const colorPaletteIndexFinder = (mouseDownCoord, colorPaletteCoords, isInsideButtonRegion) => {

  for (let i = 0; i < colorPaletteCoords.length; i++) {
    if (isInsideButtonRegion({
      x0: colorPaletteCoords[i][0], x1: colorPaletteCoords[i][0] + 30,
      y0: colorPaletteCoords[i][1], y1: colorPaletteCoords[i][1] + 30
    }, { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY })) {
      return i;
    }
  }
  return null;
}

export const isOutsideColorButton = (colorIndex, mouseCoord, colorPaletteCoords, isInsideButtonRegion) => {
  if (colorIndex === null) { return null; }

  return !isInsideButtonRegion({
    x0: colorPaletteCoords[colorIndex][0], x1: colorPaletteCoords[colorIndex][0] + 30,
    y0: colorPaletteCoords[colorIndex][1], y1: colorPaletteCoords[colorIndex][1] + 30
  }, { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY })
}

export const buttonFinder = (mouseDownCoord, style, isInsideButtonRegion) => {
  const width = parseFloat(style.width);

  switch (true) {
    case isInsideButtonRegion({ x0: width - 30, x1: width, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "x";

    case isInsideButtonRegion({ x0: 0, x1: 30, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "rectangle";

    case isInsideButtonRegion({ x0: 32, x1: 62, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "circle";

    case isInsideButtonRegion({ x0: 64, x1: 94, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "line";

    case isInsideButtonRegion({ x0: 96, x1: 126, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "pencil";

    case isInsideButtonRegion({ x0: 128, x1: 158, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "color";

    case isInsideButtonRegion({ x0: width - 62, x1: width - 32, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "redo";

    case isInsideButtonRegion({ x0: width - 94, x1: width - 64, y0: 0, y1: 30 },
      { offsetX: mouseDownCoord.offsetX, offsetY: mouseDownCoord.offsetY }):
      return "undo";

    default:
      return null;
  }


}

export const isOutsideButton = (buttonName, mouseCoord, style, isInsideButtonRegion) => {
  const width = parseFloat(style.width);

  switch (buttonName) {
    case "x":
      return !isInsideButtonRegion({ x0: width - 30, x1: width, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "rectangle":
      return !isInsideButtonRegion({ x0: 0, x1: 30, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "circle":
      return !isInsideButtonRegion({ x0: 32, x1: 62, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "line":
      return !isInsideButtonRegion({ x0: 64, x1: 94, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "pencil":
      return !isInsideButtonRegion({ x0: 96, x1: 126, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "color":
      return !isInsideButtonRegion({ x0: 128, x1: 158, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "redo":
      return !isInsideButtonRegion({ x0: width - 62, x1: width - 32, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    case "undo":
      return !isInsideButtonRegion({ x0: width - 94, x1: width - 64, y0: 0, y1: 30 },
        { offsetX: mouseCoord.offsetX, offsetY: mouseCoord.offsetY });

    default:
      return null;
  }
}

// CANVAS MANIPULATION SERVICES

// export const clearCanvas = (ctx, style) => {
//   const width = parseFloat(style.width);
//   const height = parseFloat(style.height);
//   //clearing only the drawable canvas
//   ctx.clearRect(158, 0, width - 252, 30);
//   ctx.clearRect(0, 30, width, height - 30);
// }
export const clearCanvas = (offCtx, offCanvas) => {
  //Clear the offscreen canvas
  offCtx.save();
  offCtx.fillStyle = "#f9faf4";
  offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);
  offCtx.restore();
}

export const setDrawProps = (ctx, { lineWidth = 1, color = "black", lineCap = "round", lineJoin = "round" }) => {
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = lineCap;
  ctx.lineJoin = lineJoin;
  // color
  // etc.. properties
}

export const startPencilDraw = (offCtx, { offsetX, offsetY }) => {
  //native event is the event of DOM
  offCtx.beginPath();
  offCtx.moveTo(offsetX, offsetY)
}

export const drawPencil = (offCtx, { clientX, clientY }, initCoord) => {

  //  clientX(drawing's) - (clientX(moveTo's) - initialMoveToX(offCtx)) , clientY(drawing's) - (clientY(moveTo's) - initialMoveToY(offCtx)) -> substitute below
  offCtx.lineTo(clientX - (initCoord.xClient - initCoord.xOffset), clientY - (initCoord.yClient - initCoord.yOffset));
  offCtx.stroke();
}

export const drawDot = (offCtx, { offsetX, offsetY }) => {
  // offsetX is reduced by width of line to position the dot with the continuing line correctly.

  // offCtx.fillRect(offsetX - offCtx.lineWidth / 2, offsetY - offCtx.lineWidth / 2, 4, 4);
  offCtx.fillRect(offsetX - offCtx.lineWidth / 2, offsetY - offCtx.lineWidth / 2, 4, 4);
}

export const drawRectangle = (offCtx, { clientX, clientY }, initCoord) => {
  offCtx.strokeRect(initCoord.xOffset, initCoord.yOffset, clientX - initCoord.xClient, clientY - initCoord.yClient);
}


export const drawCircle = (offCtx, { clientX, clientY }, initCoord) => {
  // clientX, clientY is your Mousecoordinates while drawing -from the top left corner of Windows as (0,0)
  offCtx.beginPath();
  // dynamic center - having your circumference starting from the initialCoord. If you want static center, then only give xOffset and yOffset
  offCtx.arc(initCoord.xOffset + (clientX - initCoord.xClient) / 2, initCoord.yOffset + (clientY - initCoord.yClient) / 2,
    Math.sqrt((clientX - initCoord.xClient) ** 2 + (clientY - initCoord.yClient) ** 2) / 2, 0, 2 * Math.PI);
  offCtx.stroke();

}

export const drawLine = (offCtx, { clientX, clientY }, initCoord) => {
  offCtx.beginPath();
  offCtx.moveTo(initCoord.xOffset, initCoord.yOffset);
  offCtx.lineTo(clientX - (initCoord.xClient - initCoord.xOffset), clientY - (initCoord.yClient - initCoord.yOffset));
  offCtx.stroke();
}

export const copyDrawableCanvas = (ctx, style) => {
  const width = parseFloat(style.width);
  const height = parseFloat(style.height);
  const imgData = [];
  imgData.push(ctx.getImageData(0, 30, width, height - 30));
  imgData.push(ctx.getImageData(158, 0, width - 252, 30));
  return imgData;
}

export const pasteDrawableCanvas = (ctx, drawableCanvasImgDataArray) => {
  ctx.putImageData(drawableCanvasImgDataArray[0], 0, 30);
  ctx.putImageData(drawableCanvasImgDataArray[1], 158, 0);
}

export const pasteOffscreenCanvas = (ctx, offCanvas) => {
  ctx.drawImage(offCanvas, 0, 0);
}
// export const isEqualImgDatas = ({ imgData1, imgData2 }) => {
//   for (let i = 0; i < imgData1[0].data.length; i++) {
//     if (imgData1[0].data[i] !== imgData2[0].data[i]) {
//       return false;
//     }
//   }
//
//   for (let i = 0; i < imgData1[1].data.length; i++) {
//     if (imgData1[1].data[i] !== imgData2[1].data[i]) {
//       return false;
//     }
//   }
//
//   return true;
// }

export const drawUndoRedoArray = (undoOrRedo, offCtx, offCanvas, clearCanvas, setDrawProps,
  { drawRectangle, drawCircle, drawLine, drawPencil, drawDot }) => {

  offCtx.save();

  const undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));
  const undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
  const xPreviousPosition = Number(window.localStorage.getItem("xPreviousPosition"));

  if (undoOrRedo === "undo") {
    let i = 0;
    // start the drawings from the previous X (To increase performance of Undos)
    if (xPreviousPosition !== -1 && xPreviousPosition <= undoRedoArrayPointer) { i = xPreviousPosition + 1; }
    for (i; i <= undoRedoArrayPointer; i++) {
      const shapeObject = undoRedoArray[i];
      // you can give lineWidth to shapePrototypes and then give shapeObject.lineWidth here - if needed. Until then. It's hardcoded
      setDrawProps(offCtx, { lineWidth: 4, color: shapeObject.color });

      if (shapeObject.type === "rectangle") {
        drawRectangle(offCtx, { clientX: shapeObject.props[0], clientY: shapeObject.props[1] }, shapeObject.props[2]);
      } else if (shapeObject.type === "circle") {
        drawCircle(offCtx, { clientX: shapeObject.props[0], clientY: shapeObject.props[1] }, shapeObject.props[2]);
      } else if (shapeObject.type === "line") {
        drawLine(offCtx, { clientX: shapeObject.props[0], clientY: shapeObject.props[1] }, shapeObject.props[2]);
      } else if (shapeObject.type === "pencilDraw") {
        startPencilDraw(offCtx, { offsetX: shapeObject.start[0], offsetY: shapeObject.start[1] });
        for (let [clientX, clientY, initCoord] of shapeObject.props) {
          drawPencil(offCtx, { clientX: clientX, clientY: clientY }, initCoord);
        }
        offCtx.beginPath();
      } else if (shapeObject.type === "pencilDot") {
        drawDot(offCtx, { offsetX: shapeObject.props[0], offsetY: shapeObject.props[1] });
      } else if (shapeObject.type === "x") {
        clearCanvas(offCtx, offCanvas);
      }
    }
  } else if (undoOrRedo === "redo") {
    const shapeObject = undoRedoArray[undoRedoArrayPointer];
    setDrawProps(offCtx, { lineWidth: 4, color: shapeObject.color });
    if (shapeObject.type === "rectangle") {
      drawRectangle(offCtx, { clientX: shapeObject.props[0], clientY: shapeObject.props[1] }, shapeObject.props[2]);
    } else if (shapeObject.type === "circle") {
      drawCircle(offCtx, { clientX: shapeObject.props[0], clientY: shapeObject.props[1] }, shapeObject.props[2]);
    } else if (shapeObject.type === "line") {
      drawLine(offCtx, { clientX: shapeObject.props[0], clientY: shapeObject.props[1] }, shapeObject.props[2]);
    } else if (shapeObject.type === "pencilDraw") {
      startPencilDraw(offCtx, { offsetX: shapeObject.start[0], offsetY: shapeObject.start[1] });
      for (let [clientX, clientY, initCoord] of shapeObject.props) {
        drawPencil(offCtx, { clientX: clientX, clientY: clientY }, initCoord);
      }
      offCtx.beginPath();
    } else if (shapeObject.type === "pencilDot") {
      drawDot(offCtx, { offsetX: shapeObject.props[0], offsetY: shapeObject.props[1] });
    } else if (shapeObject.type === "x") {
      clearCanvas(offCtx, offCanvas);
    }
  }

  offCtx.restore();

}
