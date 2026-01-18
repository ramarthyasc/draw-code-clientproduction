import '../styles/Canvas.css';
import { useRef, useEffect, useState, useMemo } from 'react';
import {
    setDrawProps, buttonImagesCreator, buttonRender, startPencilDraw, drawPencil, drawDot, drawRectangle, drawCircle, drawLine,
    clearCanvas, isInsideButtonRegion, buttonFinder, isOutsideButton, colorPaletteImagesCreator, colorPaletteRender, copyDrawableCanvas,
    pasteDrawableCanvas, colorPaletteIndexFinder, isOutsideColorButton, drawUndoRedoArray, pasteOffscreenCanvas
}
    from '../services/canvasService.js';
import { forwardRef } from 'react';

// NOTE : When you do 'X', and you have an 'X' already in the array behind the current 'X', then clear the previous 'X'
// and elements before them
// ie; There will be only one "X" in the array at a time.

// NOTE : Buttons are rendered only on the Drawable canvas - not on the Offscreen canvas. Offscreen canvas used only for Drawings

//forwardRef function returns a Component (which returns a jsx). Here, we used this bcs to transfer ref from the parent
export const Canvas = forwardRef((props, canvasRef) => {
    const contextRef = useRef();
    //whichShapeSelectedRef helps isDrawingRef identify which shape to draw when i click and hold on the canvas
    /// by default, pencil is true
    const whichShapeSelectedRef = useRef({ pencil: true, rectangle: false, circle: false, line: false });
    //isDrawingRef is for allowing to draw any shapes on the canvas - this is general for all shapes
    //mouseUpRef decides if isDrawingRef is enabled or not. So this is the entry point for drawing
    const isDrawingRef = useRef(false);
    const mouseUpRef = useRef(true);
    const buttonIsWhiteRef = useRef(false);
    const mouseDownCoordRef = useRef({});
    const buttonsRef = useRef({
        x: "x", redo: "redo", undo: "undo", rectangle: "rectangle",
        circle: "circle", line: "line", pencil: "pencil", color: "color"
    });
    // we have implicit positioning - as colors is an Array -> in order of color palette presentation in the canvas
    const colorsRef = useRef(["black", "red", "green", "blue", "orange"]);
    // x, redo, undo put in buttonCoordRef in useEffects - because rect.width won't become visible before rendering the canvas element
    const buttonCoordRef = useRef({
        rectangle: { x0: 0, x1: 30, y0: 0, y1: 30 },
        circle: { x0: 32, x1: 62, y0: 0, y1: 30 }, line: { x0: 64, x1: 94, y0: 0, y1: 30 }, pencil: { x0: 96, x1: 126, y0: 0, y1: 30 },
        color: { x0: 128, x1: 158, y0: 0, y1: 30 },
    })
    // we have implicit positioning - as colors is an Array -> in order of color palette presentation in the canvas
    const colorPaletteCoords = useMemo(() => {
        const colorCoords = [];
        for (let i = 0; i < colorsRef.current.length; i++) {
            if (i === 0) {
                colorCoords.push([128, 0])
            } else {
                colorCoords.push([colorCoords[i - 1][0] + 30, 0]);
            }
        }
        return colorCoords;
    }, []);

    const buttonsImgDataRef = useRef({});
    const colorPaletteImgDataRef = useRef({});
    const colorPaletteIsOnRef = useRef(false);
    // Drawing helpers : 
    const shapeInitialCoordRef = useRef({});
    const imgDataRef = useRef([]);
    // Undo :
    // [1,2,3,4,5,6,7,8,9,10]

    const shapePrototypesRef = useRef({
        pencilDot: {
            type: "pencilDot",
            color: null,
            props: []
        },
        pencilDraw: {
            type: "pencilDraw",
            color: null,
            start: [],
            props: []
        },
        rectangle: {
            type: "rectangle",
            color: null,
            props: [] // xinit, yinit, width, height
        },
        circle: {
            type: "circle",
            color: null,
            props: []
        },
        line: {
            type: "line",
            color: null,
            props: []
        },
        x: {
            type: "x"
        },
    });
    const offContextRef = useRef();
    const offCanvasRef = useRef();
    const isPendingRef = useRef(false);
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);

    //only if I hadn't set undoRedoArray in local storage, then only implement the below.
    if (!JSON.parse(window.localStorage.getItem("undoRedoArray"))) {
        window.localStorage.setItem("undoRedoArray", JSON.stringify([]));
        window.localStorage.setItem("undoRedoArrayPointer", -1);
        window.localStorage.setItem("xPreviousPosition", -1);
    }

    const undoRedoArrayPusher = (shapePrototypesRef, shape) => {
        const undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));
        const undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
        // insert in the Undo array - the shapes that we drawn :- as a stack
        const shapeProtCopy = structuredClone(shapePrototypesRef[shape]);
        // shapePrototypes should have pencilDraw object where, it's props have stored all the points until mouseup
        // If mouseUp, then call this function with "pencilDraw" as shape
        undoRedoArray.push(shapeProtCopy);
        window.localStorage.setItem("undoRedoArray", JSON.stringify(undoRedoArray));
        window.localStorage.setItem("undoRedoArrayPointer", undoRedoArrayPointer + 1);
    }


    const handleMouseMove = ({ nativeEvent }) => {
        // const rect = canvasRef.current.getBoundingClientRect();
        const style = getComputedStyle(canvasRef.current);
        const width = parseFloat(style.width);
        const { offsetX, offsetY } = nativeEvent;

        if (buttonIsWhiteRef.current) {
            const prevMouseDownButton = buttonFinder(mouseDownCoordRef.current, style, isInsideButtonRegion);
            const isOutsidePrevMouseDownButton = isOutsideButton(prevMouseDownButton, { offsetX, offsetY }, style, isInsideButtonRegion);

            // If Mouse pointer is outside that button where previous mouse down happened, then rerender the button to normal
            if (isOutsidePrevMouseDownButton) {
                buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true },
                    colorPaletteImgDataRef.current, colorsRef.current[0], prevMouseDownButton);

                Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                    if (whichShapeSelectedRef.current[key]) {
                        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true },
                            colorPaletteImgDataRef.current, colorsRef.current[0], key);
                    }
                })
                buttonIsWhiteRef.current = false;
            }

            if (colorPaletteIsOnRef.current) {
                // when you go outside the canvas, then the mouseDownCoordRef is set as {offsetX: -1,offsetY: -1}. So the bottom thing will become null.
                const prevMouseDownColorIndex = colorPaletteIndexFinder(mouseDownCoordRef.current, colorPaletteCoords, isInsideButtonRegion);
                const isOutsidePrevMouseDownColor = isOutsideColorButton(prevMouseDownColorIndex, { offsetX, offsetY },
                    colorPaletteCoords, isInsideButtonRegion);
                // If Mouse pointer is outside that color where previous mouse down happened, then rerender that color's image or whole pallete to normal
                if (isOutsidePrevMouseDownColor) {
                    colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
                    buttonIsWhiteRef.current = false;
                }
            }
        }

        //styles : 
        if (isInsideButtonRegion({ x0: 0, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY }) ||
            isInsideButtonRegion({ x0: width - 94, x1: width, y0: 0, y1: 30 }, { offsetX, offsetY })) {
            canvasRef.current.style.cursor = "pointer";
        } else if (colorPaletteIsOnRef.current && isInsideButtonRegion({
            x0: colorPaletteCoords[0][0], x1: colorPaletteCoords.at(-1)[0] + 30, y0: 0, y1: 30
        }, { offsetX, offsetY })) {
            canvasRef.current.style.cursor = "pointer";
        } else {
            canvasRef.current.style.cursor = "crosshair";
        }

        // ENTRY POINT OF DRAWING ON CANVAS :

        /// If mouse up or button is white(where we gave mouseUp there too), 
        //you have to stop any kind of drawing (continuation or anything else). Other wise, You have access to draw
        isDrawingRef.current = mouseUpRef.current ? false : true;

    }

    const handleMouseDown = ({ nativeEvent }) => {
        // const rect = canvasRef.current.getBoundingClientRect();
        const style = getComputedStyle(canvasRef.current);
        const width = parseFloat(style.width);
        const { offsetX, offsetY, clientX, clientY } = nativeEvent;

        // Iam giving coordinates with negatives for the canvas here.
        mouseDownCoordRef.current = { offsetX, offsetY };

        if (nativeEvent.button !== 0) return;

        /// If mouse up, you have to stop any kind of drawing (continuation or anything else) Here, it's false. So you have entry to Draw
        mouseUpRef.current = false; // entry point for any shape drawing on canvas
        ///

        // button highlighting: start
        if (isInsideButtonRegion({ x0: 0, x1: 158, y0: 0, y1: 30 }, { offsetX, offsetY }) ||
            isInsideButtonRegion({ x0: width - 94, x1: width, y0: 0, y1: 30 }, { offsetX, offsetY })) {
            //if the cursor is inside any button area
            for (let button in buttonsRef.current) {
                if (isInsideButtonRegion({
                    x0: buttonCoordRef.current[button].x0, x1: buttonCoordRef.current[button].x1,
                    y0: buttonCoordRef.current[button].y0, y1: buttonCoordRef.current[button].y1
                }, { offsetX, offsetY })) {

                    buttonRender(contextRef.current, style, buttonsImgDataRef.current, { highlight: true }, colorPaletteImgDataRef.current,
                        colorsRef.current[0], button);

                    buttonIsWhiteRef.current = true;
                }
            }
            mouseUpRef.current = true; // if there was any white button displayed or did click on button area, 
            // then we are starting a new drawing(not continuation). So it acts like mouseup
            return;
        }


        /// We can use isInsideButtonRegion here. (Here, button is a general area)

        // If inside the color palette area when color palette is active
        if (colorPaletteIsOnRef.current && isInsideButtonRegion({
            x0: colorPaletteCoords[0][0], x1: colorPaletteCoords.at(-1)[0] + 30, y0: 0, y1: 30
        }, { offsetX, offsetY })) {

            for (let i = 0; i < colorPaletteCoords.length; i++) {
                if (isInsideButtonRegion({
                    x0: colorPaletteCoords[i][0], x1: colorPaletteCoords[i][0] + 30,
                    y0: colorPaletteCoords[i][1], y1: colorPaletteCoords[i][1] + 30
                }, { offsetX, offsetY })) {
                    colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current, i);
                    buttonIsWhiteRef.current = true;
                    mouseUpRef.current = true; // if there was any white button displayed, then we are starting a new drawing(not continuation). So it acts like
                    //mouseup
                }
            }
            return;
        }

        // THE CODE BELOW ONLY APPLIES FOR DRAWABLE CANVAS !!!
        //
        // As there are 'return's above if cursor is in the button area/ color area[when activated], the code below WORKS ONLY FOR DRAWABLE CANVAS !!!
        // Initiating the Drawing on drawable canvas when clicking on the drawable canvas

        if (colorPaletteIsOnRef.current) {
            // Paste the previous drawable canvas if there is palette present
            pasteDrawableCanvas(contextRef.current, imgDataRef.current);
            // Then normalize the background color of just "color" button
            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true },
                colorPaletteImgDataRef.current, colorsRef.current[0], "color");

            colorPaletteIsOnRef.current = false;
        }

        /// Set properties before drawing
        setDrawProps(contextRef.current, { lineWidth: 4, color: colorsRef.current[0] });
        setDrawProps(offContextRef.current, { lineWidth: 4, color: colorsRef.current[0] });
        ///

        if (whichShapeSelectedRef.current.pencil) {
            /// if pencil is selected
            shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };
            // drawDot(contextRef.current, { offsetX, offsetY });
            shapePrototypesRef.current.pencilDraw.start = [offsetX, offsetY];
            startPencilDraw(contextRef.current, { offsetX, offsetY });
        }

        if (whichShapeSelectedRef.current.rectangle || whichShapeSelectedRef.current.circle || whichShapeSelectedRef.current.line) {
            /// if rectangle or one of other shapes is selected

            /// screenshotting the canvas before drawing the rectangle
            imgDataRef.current = copyDrawableCanvas(contextRef.current, style);
            /// Saving the clicked coordinates
            shapeInitialCoordRef.current = { xOffset: offsetX, yOffset: offsetY, xClient: clientX, yClient: clientY };

        }

        //
        //
        // Other shapes to be implemented
        //
        //
        //

    }
    useEffect(() => {
        function shortcutShapeSelector(button) {
            const style = getComputedStyle(canvasRef.current);
            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

            Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                whichShapeSelectedRef.current[key] = (key === button); // turning all others false and turning on the active button
            })
            if (colorPaletteIsOnRef.current) {
                pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                colorPaletteIsOnRef.current = false;
            }

            Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                if (whichShapeSelectedRef.current[key]) {
                    buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current,
                        colorsRef.current[0], key);
                }
            })
        }
        function shortcutUndo() {
            const style = getComputedStyle(canvasRef.current);

            clearCanvas(offContextRef.current, offCanvasRef.current);
            pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
            // if color Palette was on, then revert the drawable canvas back to the state before the palette was displayed
            colorPaletteIsOnRef.current = false;

            let undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
            if (undoRedoArrayPointer >= 0) {
                window.localStorage.setItem("undoRedoArrayPointer", undoRedoArrayPointer - 1);
                undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
            }

            if (undoRedoArrayPointer >= 0) {

                drawUndoRedoArray("undo", offContextRef.current, offCanvasRef.current, clearCanvas, setDrawProps,
                    { drawRectangle, drawCircle, drawLine, drawPencil, drawDot });
                pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
                buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

            }

            Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                if (whichShapeSelectedRef.current[key]) {
                    buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current,
                        colorsRef.current[0], key);
                }
            })
        }

        function shortcutRedo() {
            const style = getComputedStyle(canvasRef.current);
            // make the highlighted button to normal
            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

            // if color Palette was on, then revert the drawable canvas back to the state before the palette was displayed
            if (colorPaletteIsOnRef.current) {
                pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                colorPaletteIsOnRef.current = false;
            }

            const undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));
            let undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));

            window.localStorage.setItem("undoRedoArrayPointer", undoRedoArrayPointer + 1);

            undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));

            // if the pointer didn't cross the last element of array
            if (undoRedoArrayPointer < undoRedoArray.length) {
                drawUndoRedoArray("redo", offContextRef.current, offCanvasRef.current, clearCanvas, setDrawProps,
                    { drawRectangle, drawCircle, drawLine, drawPencil, drawDot });
                pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
                buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

            } else {
                window.localStorage.setItem("undoRedoArrayPointer", undoRedoArrayPointer - 1);
            }


            Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                if (whichShapeSelectedRef.current[key]) {
                    buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current,
                        colorsRef.current[0], key);
                }
            })
        }


        function onKeyDownWindow(e) {
            if (e.key === "z" && e.ctrlKey) {
                e.preventDefault();
                shortcutUndo();
            } else if (e.key === "x" && e.ctrlKey) {
                e.preventDefault();
                shortcutRedo();
            } else if (e.key === "a" && e.ctrlKey) {
                e.preventDefault();
                shortcutShapeSelector("rectangle");
            } else if (e.key === "s" && e.ctrlKey) {
                e.preventDefault();
                shortcutShapeSelector("circle");
            } else if (e.key === "d" && e.ctrlKey) {
                e.preventDefault();
                shortcutShapeSelector("line");
            } else if (e.key === "f" && e.ctrlKey) {
                e.preventDefault();
                shortcutShapeSelector("pencil");
            }

        }

        window.addEventListener("keydown", onKeyDownWindow);
        return () => {
            window.removeEventListener("keydown", onKeyDownWindow);
        }

    }, [])

    const handleMouseUp = ({ nativeEvent }) => {

        // const rect = canvasRef.current.getBoundingClientRect();
        const style = getComputedStyle(canvasRef.current);
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        const { offsetX, offsetY } = nativeEvent;

        if (nativeEvent.button !== 0) return;


        // If mouse up, you have to stop any kind of drawing (continuation or anything else) - set isDrawingRef = false in MouseMove
        // The below two lines are given in the window's mouseup eventhandler function; So don't need them in the canvas - redundant
        // mouseUpRef.current = true;
        // isDrawingRef.current = mouseUpRef.current ? false : true;


        // Capture dots in the undo array when you mouseDown inside the drawable canvas
        // -( dots are pushed only if you didn't draw a pencil curve in continuation)
        if (!isDrawingRef.current && whichShapeSelectedRef.current.pencil) {

            if (!((!colorPaletteIsOnRef.current && (!isInsideButtonRegion({ x0: 158, x1: width - 94, y0: 0, y1: 30 },
                { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }) &&
                !isInsideButtonRegion({ x0: 0, x1: width, y0: 30, y1: height },
                    { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }))) ||
                (colorPaletteIsOnRef.current && (!isInsideButtonRegion({ x0: 278, x1: width - 94, y0: 0, y1: 30 },
                    { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }) &&
                    !isInsideButtonRegion({ x0: 0, x1: width, y0: 30, y1: height },
                        { offsetX: mouseDownCoordRef.current.offsetX, offsetY: mouseDownCoordRef.current.offsetY }))))) {

                const undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));
                const undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
                const xPreviousPosition = Number(window.localStorage.getItem("xPreviousPosition"));

                if (undoRedoArrayPointer < undoRedoArray.length - 1) {
                    //set the array to the length at which the pointer is on right now
                    undoRedoArray.length = undoRedoArrayPointer + 1; // pointerRed is 0 based index
                    window.localStorage.setItem("undoRedoArray", JSON.stringify(undoRedoArray));
                }
                //if the pointer is before the xPreviousPosition, then set xPreviousPosition to -1 as there is no X position now.
                if (xPreviousPosition >= 0 && xPreviousPosition > undoRedoArrayPointer) {
                    window.localStorage.setItem("xPreviousPosition", -1);
                }


                //draw in both canvases
                drawDot(offContextRef.current, { offsetX, offsetY });
                drawDot(contextRef.current, { offsetX, offsetY });

                //
                shapePrototypesRef.current.pencilDot.props = [offsetX, offsetY];
                shapePrototypesRef.current.pencilDot.color = colorsRef.current[0];
                undoRedoArrayPusher(shapePrototypesRef.current, "pencilDot");
                //

            }
        }

        if (buttonIsWhiteRef.current) {
            //ie; if the onMouseUp is done on the button without leaving the button after onMouseDown on that button (ie; Button is White on mouseup)

            for (let button in buttonsRef.current) {
                if (isInsideButtonRegion({
                    x0: buttonCoordRef.current[button].x0, x1: buttonCoordRef.current[button].x1,
                    y0: buttonCoordRef.current[button].y0, y1: buttonCoordRef.current[button].y1
                }, { offsetX, offsetY })) {

                    if (button === "x") {
                        clearCanvas(offContextRef.current, offCanvasRef.current);
                        pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
                        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

                        let undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));
                        let undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));

                        if (undoRedoArrayPointer != -1 && undoRedoArray.length) {
                            // compare the previous and the last one of the undo array, then, if they are same, then don't push
                            if (undoRedoArray[undoRedoArrayPointer].type !== "x") {


                                // NOTE : When you do 'X', and you have an 'X' already in the array behind the current 'X', then clear the previous 'X'
                                // and elements before them

                                if (undoRedoArrayPointer < undoRedoArray.length - 1) {
                                    undoRedoArray.length = undoRedoArrayPointer + 1; // pointerRed is 0 based index
                                    window.localStorage.setItem("undoRedoArray", JSON.stringify(undoRedoArray));
                                }
                                // if previous position of 'X' is before the undoRedoArrayPointer,then delete all the elements before "X", including "X"
                                // in the undoRedoArray
                                let xPreviousPosition = Number(window.localStorage.getItem("xPreviousPosition"));
                                if (xPreviousPosition !== -1 && (xPreviousPosition < undoRedoArrayPointer)) {
                                    undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));

                                    let tempUndoRedoArray = [];
                                    for (let i = xPreviousPosition + 1; i <= undoRedoArrayPointer; i++) {
                                        tempUndoRedoArray.push(undoRedoArray[i]);
                                    }
                                    window.localStorage.setItem("undoRedoArray", JSON.stringify(tempUndoRedoArray));
                                    window.localStorage.setItem("undoRedoArrayPointer", tempUndoRedoArray.length - 1);
                                }

                                undoRedoArrayPusher(shapePrototypesRef.current, "x");

                                //xPreviousPosition is set
                                undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
                                window.localStorage.setItem("xPreviousPosition", undoRedoArrayPointer);


                            }
                        }
                        // To avoid pasteDrawableCanvas happening - when i click X, and click on any shape , the previous drawing comes into display.
                        colorPaletteIsOnRef.current = false;
                    }


                    //
                    // Rerender the buttons which are unselected to normal mode. ie; Render all buttons in normal mode
                    // buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

                    // Setting state on what is to be drawn

                    if (button === "rectangle" || button === "pencil" || button === "circle" || button === "line") {
                        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

                        Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                            whichShapeSelectedRef.current[key] = (key === button); // turning all others false and turning on the active button
                        })
                        if (colorPaletteIsOnRef.current) {
                            pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                            colorPaletteIsOnRef.current = false;
                        }
                    } else if (button === "color") {
                        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
                        // don't lightgrey the selected whichShapeSelectedRef buttons. let it be there.

                        if (colorPaletteIsOnRef.current) {
                            pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                            colorPaletteIsOnRef.current = false;
                        } else {
                            /// copy the contents - before displaying the color palette
                            imgDataRef.current = copyDrawableCanvas(contextRef.current, style);

                            // Render the color palette including the first selected dark grey bg color
                            colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
                            colorPaletteIsOnRef.current = true
                        }
                    }
                    //
                    // other shapes to be implemented
                    //

                    // The below code is put below others because, "undo" have to pasteDrawableCanvas by overwriting others above if any ( Nothing of that
                    // is there above right now)

                    //UndoRedo chain is activated-when you press undo button. It deactivates when :1) redo has reached it's end (no items in redo array)
                    //2) When you push to the undoRef stack (when you draw something or dot) except when redoing
                    //3) Initially, When there is nothing in the undoRef stack. ie; You didn't draw anything on canvas initially
                    if (button === "undo") {

                        clearCanvas(offContextRef.current, offCanvasRef.current);
                        pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
                        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
                        // if color Palette was on, then revert the drawable canvas back to the state before the palette was displayed
                        colorPaletteIsOnRef.current = false;

                        let undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
                        if (undoRedoArrayPointer >= 0) {
                            window.localStorage.setItem("undoRedoArrayPointer", undoRedoArrayPointer - 1);
                            undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
                        }

                        if (undoRedoArrayPointer >= 0) {

                            drawUndoRedoArray("undo", offContextRef.current, offCanvasRef.current, clearCanvas, setDrawProps,
                                { drawRectangle, drawCircle, drawLine, drawPencil, drawDot });
                            pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
                            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

                        }
                    }

                    // NOTE : 
                    // if you draw something, then press X, then undo, then redo, then press X again, then you will not have 2 stacked blank pages
                    // The System of Undo - Redo works perfectly right now.
                    // ie; There will be only one "X" in the array at a time.
                    if (button === "redo") {
                        // make the highlighted button to normal
                        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

                        // if color Palette was on, then revert the drawable canvas back to the state before the palette was displayed
                        if (colorPaletteIsOnRef.current) {
                            pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                            colorPaletteIsOnRef.current = false;
                        }

                        const undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));
                        let undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));

                        window.localStorage.setItem("undoRedoArrayPointer", undoRedoArrayPointer + 1);

                        undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));

                        // if the pointer didn't cross the last element of array
                        if (undoRedoArrayPointer < undoRedoArray.length) {
                            drawUndoRedoArray("redo", offContextRef.current, offCanvasRef.current, clearCanvas, setDrawProps,
                                { drawRectangle, drawCircle, drawLine, drawPencil, drawDot });
                            pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
                            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

                        } else {
                            window.localStorage.setItem("undoRedoArrayPointer", undoRedoArrayPointer - 1);
                        }
                    }

                    /// Changing background color of selected button's button ((removed "color" button from whichShapeSelectedRef -because it's "select" &
                    // "highlight"(when palette is on) is handled by color palette. (highlight when colorPalette is off - is handled by color in buttonsRef)
                    //by colorPalette))
                    Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                        if (whichShapeSelectedRef.current[key]) {
                            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current,
                                colorsRef.current[0], key);
                        }
                    })
                    ///

                    buttonIsWhiteRef.current = false;
                    return;


                }
            }

            // Color Picking 

            if (colorPaletteIsOnRef.current) {

                // get the index in which i am upping the mouse - use colorPaletteIndexFinder()
                // In 'colorsRef.current', swap the ith index color with the 0th index.
                // setDrawProps color to colorsRef.current[0];
                // pasteDrawableCanvas, & colorPaletteIsOnRef = false;
                // render the "color" button only - from the buttonRender function
                const mouseUpColorIndex = colorPaletteIndexFinder({ offsetX, offsetY }, colorPaletteCoords, isInsideButtonRegion);
                //// swapping
                [colorsRef.current[0], colorsRef.current[mouseUpColorIndex]] = [colorsRef.current[mouseUpColorIndex], colorsRef.current[0]];
                pasteDrawableCanvas(contextRef.current, imgDataRef.current);

                colorPaletteIsOnRef.current = false;

                buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true },
                    colorPaletteImgDataRef.current, colorsRef.current[0], "color");


            }

        }

    }



    const handleMouseLeave = () => {

        // const rect = canvasRef.current.getBoundingClientRect();
        const style = getComputedStyle(canvasRef.current);

        if (buttonIsWhiteRef.current) {
            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

            Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                if (whichShapeSelectedRef.current[key]) {
                    buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true },
                        colorPaletteImgDataRef.current, colorsRef.current[0], key);
                }
            })
            buttonIsWhiteRef.current = false;
        }

        if (colorPaletteIsOnRef.current) {
            colorPaletteRender(contextRef.current, colorsRef.current, colorPaletteCoords, colorPaletteImgDataRef.current);
        }

        //  We don't want any mouseDowns outside the canvas to affect the undo array pushes -
        // when you do mouseUp in canvas just after mouseDown outside the canvas. So we set mouseDownCoords to (-1,-1) 
        // when you leave canvas. And we don't want dots to appear when i mouseDown outside the canvas and mouseUp inside the canvas
        mouseDownCoordRef.current = { offsetX: -1, offsetY: -1 };
    }




    useEffect(() => {
        // Initialize the Canvas
        //
        const canvas = canvasRef.current;
        //get the CSS pixels or CSS size of the canvas's content box only (as css's box-sizing is set to content-box for the Canvas.css). 
        //Not including border or padding. --VERY IMPORTANT
        const style = getComputedStyle(canvas); // gets the CSS width & height of the canvas
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        // putImageData doesn't care about scaling - and only draws exactly on Canvas pixels.(doesn't get scaled). So Buttons and Line/Rectangle/Circle
        // rendering won't be done correctly when zoomed in the webapp and refreshed. So we only need Scale of 1 ie; DPR should be 1 even when i zoom
        // the canvas in web. NOTE: DPR increase according to the zoom percentage of webapp. Eg; 150% zoom => 1.5 DPR
        const scale = 1; //window.devicePixelRatio;
        // This makes the no. of canvas pixels [internal bitmap of canvas] 
        // in the width (canvas.width) and height (canvas.height) equal to the no. of physical pixels. Thus increasing clarity.
        // NOTE: THE STORY STARTS ::
        // By default, No. of Canvas pixels = No. of Css pixels.
        // DON"T CARE ABOUT CSS PIXELS. ONLY CARE ABOUT BITMAP ie; CANVAS PIXELS, and PHYSICAL PIXELS
        //The no. of Canvas Pixels should match with the no. of Physical pixels on the screen, otherwise - sure Blur.
        //Because the Bitmap doesn't have enough data to give to all the physical pixels (dpr>1) ie; 1
        //Physical pixel will have only a fraction of the canvas pixel. or, one Physical
        //pixel will have many canvas pixels, overwhelming the physical pixel (dpr < 1). So it interpolates.
        //
        //DevicePixelRatio is the ratio of the css pixel width or height(pixel = square) to the physical pixel 
        //width or height. ie; Think it like this : No of physical pixels widths for 1 css pixel width = dpr
        //So if DPR = 2, then we have css pixel width = 2x physical pixel width.
        // We already know that our Canvas pixel width is the same as Css pixel width by default when context creation.
        //As we have 2 physical pixel widths for 1 css pixel, we also need 2 canvas pixel widths for 1 css pixel width.ie;
        //We need to shrink the Canvas pixel width by half. To do that, we can double the no. of canvas pixels 
        //within the same canvas width (css area).
        //So we multiply the css total width (No. of css pixels in the width) by dpr(ie; 2) to get the canvas total width (Total width means No. of pixels in the width). & similarly for height. That's it.. to get a clear Image
        //NOTE : THE STORY ENDS HERE
        //
        // CSS PIXEL = pixels that the whole webpage is made of (style.width, style.height)
        //
        // CANVAS PIXEL = (canvas.width, canvas.height) pixels that the canvas is made of -- on which you draw NOTE: IMPPPPP PLAYER
        // PHYSICAL PIXEL = the pixels that the physical screen is made out of
        // CONTEXT or CTX = Gives you the Drawing coordinates inside the Canvas (Internal drawing space only. Doesn't include padding or borders). This
        // is the same as Canvas pixels. The Coordinates of Canvas pixels is Context/ CTX.  NOTE : IMPPPP PLAYER
        // When we give values of Coordinates, as a human, we give what we visually see- Which is - the no. of pixels of css is given to the ctx as coordinates.
        // So we need to scale it so that the machine could understand the coordinate values given by us (which is the css pixels dimensions we give)
        // 
        // For example, the portion of the canvas can have width of 600 CSS pixels.
        // The canvas will be 1200 Canvas pixels - on which we draw.
        // But the coordinates are numbers given by us. For example when i click on (300, 200) on the canvas (We always reference coordinates wrt
        // the CSS pixels.), ie; i Click midway wrt width on the the canvas, the drawing will be shown on 1/4th the width of the canvas visually (css).
        // Because, we inserted 300 to the function, but the 300 is taken into as canvas pixels. Which is 1/4th of the canvas width visually.
        // So, we want to scale the drawing coordinates (ie; CTX)  such that when i type 300, then it should draw at 600. ie; It should match the
        // Canvas pixels.
        // We had scaled the Canvas pixels and increased the Canvas pixel width and height to physical pixel amount by using Scaling factor 
        // (devicePixelRatio).
        // We can use the same scaling factor to increase the VISUAL PIXELS in the canvas to the same amount of CANVAS PIXELS. Using ctx.scale().
        // So that when we draw, it's accurate visually wrt the coordinates i had given to draw.
        canvas.width = width * scale; //canvas.width and canvas.height only include internal drawing buffer. ie; it doesn't include Border & Paddings
        canvas.height = height * scale; // so we have to find an equivalent css pixel width (style.width) to scale it to get canvas.width or height


        const ctx = canvas.getContext('2d');
        // When we draw anything in the context using the css pixels, it scales it realtime to match the no. of canvas pixels. 
        // But here, we can comment the next line out - and it doesn't make any effect because scale == 1. But it's good to include it
        // if the code is in another laptop or screen
        //
        // putImageData doesn't care about scaling - and only draws exactly on Canvas pixels.(doesn't get scaled). So Buttons and Line/Rectangle/Circle
        // rendering won't be done correctly when zoomed in the webapp and refreshed.
        ctx.scale(scale, scale);


        // setting the context to ContextRef
        contextRef.current = ctx;

        //create an inmemory Canvas - which acts like the permanent store of all drawings -and where we do undo-redos. So we don't have to repaint the 
        //original visual canvas everytime we draw something.
        offCanvasRef.current = new OffscreenCanvas(window.innerWidth * scale, canvas.height);
        const offctx = offCanvasRef.current.getContext("2d");

        offContextRef.current = offctx;


        // create and store buttons in an object datastructure
        buttonsImgDataRef.current = buttonImagesCreator(buttonsRef.current, contextRef.current, style);
        // create and store color palette imgs data in an object datastructure
        colorPaletteImgDataRef.current = colorPaletteImagesCreator(contextRef.current, colorsRef.current);

        // Buttons Render
        // buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
        // /// drawPencil is active by default. So color the button bg
        // buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current, null, "pencil");

        //Render the current drawing in the canvas

        const undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
        if (undoRedoArrayPointer >= 0) {
            drawUndoRedoArray("undo", offContextRef.current, offCanvasRef.current, clearCanvas, setDrawProps,
                { drawRectangle, drawCircle, drawLine, drawPencil, drawDot });
            pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
        }


    }, [innerHeight, innerWidth]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const style = getComputedStyle(canvas);
        const width = parseFloat(style.width);
        const height = parseFloat(style.height);
        const scale = 1; //window.devicePixelRatio;
        //SETTING CANVAS.WIDTH & HEIGHT CLEARS ALL THE CANVAS PIXELS TO TRANSPARENT PIXELS (0,0,0,0) - same as doing clearRect on full viewable canvas 
        // Resets : 
        // - All pixels in both height and width
        // - All context states (lineWidth, fillStyle, strokeStyle, etc..)
        // - Resets transformation matrix in both width and height of each pixel- same as calling ctx.resetTransform()
        canvas.width = width * scale;
        canvas.height = height * scale;

        contextRef.current = canvas.getContext('2d');
        contextRef.current.scale(scale, scale);

        //paste the drawable canvas - putImageData pastes on the canvas pixels and It won't scale. Advantageous to us.ie; Drawings won't stretch
        //when i resize the canvas using slider 

        pasteOffscreenCanvas(contextRef.current, offCanvasRef.current);
        if (colorPaletteIsOnRef.current) { colorPaletteIsOnRef.current = false };


        // This is put here, becasue canvasRef won't get initiated before canvas element is rendered
        buttonCoordRef.current['x'] = {
            x0: width - 30,
            x1: width, y0: 0, y1: 30
        }
        buttonCoordRef.current["redo"] = { x0: width - 62, x1: width - 32, y0: 0, y1: 30 }
        buttonCoordRef.current["undo"] = { x0: width - 94, x1: width - 64, y0: 0, y1: 30 }

        // Buttons Rendered only on the Drawable canvas - not on the Offscreen canvas. Offscreen canvas used only for Drawings
        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);

        /// select the active button
        Object.keys(whichShapeSelectedRef.current).forEach((key) => {
            if (whichShapeSelectedRef.current[key]) {
                buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true }, colorPaletteImgDataRef.current, null, key);
            }
        })

    }, [props.canvasEdgeMotionCoord, innerHeight, innerWidth])


    // Event listener attacher - after the useEffects above is run
    useEffect(() => {

        // const rect = canvasRef.current.getBoundingClientRect();
        const style = getComputedStyle(canvasRef.current);

        // on mouseUpRef on any place on window or if the user leaves the browser, turn mouseUpRef = true
        function handleMouseUpOrLeaveWindow(e) {


            if (isDrawingRef.current) {// works only for 1 mouse up outside the canvas

                let undoRedoArray = JSON.parse(window.localStorage.getItem("undoRedoArray"));
                const undoRedoArrayPointer = Number(window.localStorage.getItem("undoRedoArrayPointer"));
                const xPreviousPosition = Number(window.localStorage.getItem("xPreviousPosition"));

                if (undoRedoArrayPointer < undoRedoArray.length - 1) {
                    undoRedoArray.length = undoRedoArrayPointer + 1; // pointerRed is 0 based index
                    window.localStorage.setItem("undoRedoArray", JSON.stringify(undoRedoArray));
                }
                //if the pointer is before the xPreviousPosition, then set xPreviousPosition to -1 as there is no X position now.
                if (xPreviousPosition >= 0 && xPreviousPosition > undoRedoArrayPointer) {
                    window.localStorage.setItem("xPreviousPosition", -1);
                }


                if (whichShapeSelectedRef.current.rectangle || whichShapeSelectedRef.current.circle || whichShapeSelectedRef.current.line) {

                    const whichShapeSelected = Object.keys(whichShapeSelectedRef.current).find((key) => {
                        return whichShapeSelectedRef.current[key];
                    })
                    shapePrototypesRef.current[whichShapeSelected].props = [e.clientX, e.clientY, shapeInitialCoordRef.current];
                    shapePrototypesRef.current[whichShapeSelected].color = colorsRef.current[0];
                    undoRedoArrayPusher(shapePrototypesRef.current, whichShapeSelected);

                    // insert the drawings into Offscreen canvas too
                    if (whichShapeSelectedRef.current.rectangle) {
                        drawRectangle(offContextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
                    } else if (whichShapeSelectedRef.current.circle) {
                        drawCircle(offContextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
                    } else if (whichShapeSelectedRef.current.line) {
                        drawLine(offContextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
                    }

                } else if (whichShapeSelectedRef.current.pencil) {

                    // The callback function of this requestAnimation runs only after requestAnimation callback of handleMousemove
                    // as the it is queued first
                    requestAnimationFrame(() => {
                        shapePrototypesRef.current.pencilDraw.color = colorsRef.current[0];
                        undoRedoArrayPusher(shapePrototypesRef.current, "pencilDraw");
                        //reset the shapePrototypesRef to []
                        shapePrototypesRef.current.pencilDraw.props = [];

                        // cut the previous path when you do mouseup for pencil (Otherwise the cleared paths will get displayed)
                        contextRef.current.beginPath();
                        offContextRef.current.beginPath();
                        //
                        //reset isPendingRef
                        // isPendingRef.current = -1;

                    })
                }

            }

            mouseUpRef.current = true;
            //obviously, the below is true. But i wrote it for making the mouseUp control the isDrawingRef (even outside the canvas).
            isDrawingRef.current = mouseUpRef.current ? false : true;

        }

        window.addEventListener("mouseleave", handleMouseUpOrLeaveWindow);
        window.addEventListener("mouseup", handleMouseUpOrLeaveWindow);

        // for closure - ie; getting the latest coordinates when the rAF callback runs
        let clientX;
        let clientY;
        function handleMouseMoveWindow(e) {

            // Drawing of shapes on the Canvas : (The continuation from OnMouseDown)
            //
            if (isDrawingRef.current) {

                if (whichShapeSelectedRef.current.pencil) { /// by default, pencil is true
                    clientX = e.clientX;
                    clientY = e.clientY;

                    // isPendingRef.current += 1;

                    // if (isPendingRef.current > 3) { isPendingRef.current = 0; }
                    // if (isPendingRef.current === 0) {
                    if (!isPendingRef.current) {
                        isPendingRef.current = true;
                        requestAnimationFrame(() => {
                            /// for pencil === true
                            //Draw on both canvas pixels
                            drawPencil(contextRef.current, { clientX, clientY }, shapeInitialCoordRef.current);
                            drawPencil(offContextRef.current, { clientX, clientY }, shapeInitialCoordRef.current);
                            shapePrototypesRef.current.pencilDraw.props.push([clientX, clientY, shapeInitialCoordRef.current]);

                            buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
                            Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                                if (whichShapeSelectedRef.current[key]) {
                                    buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true },
                                        colorPaletteImgDataRef.current, colorsRef.current[0], key);
                                }
                            })
                            isPendingRef.current = false;
                        })

                    }
                    // }
                }

                if (whichShapeSelectedRef.current.rectangle) {
                    /// for rectangle === true /// getImageData is done on MouseDown
                    //The pasteDrawableCanvas is for preventing rendering many rectangles
                    pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                    drawRectangle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
                }

                if (whichShapeSelectedRef.current.circle) {
                    pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                    drawCircle(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
                }

                if (whichShapeSelectedRef.current.line) {
                    pasteDrawableCanvas(contextRef.current, imgDataRef.current);
                    drawLine(contextRef.current, { clientX: e.clientX, clientY: e.clientY }, shapeInitialCoordRef.current);
                }
                //
                //
                //
                //Other shapes to be implemented
                //
                //
                buttonRender(contextRef.current, style, buttonsImgDataRef.current, { normal: true }, colorPaletteImgDataRef.current, colorsRef.current[0]);
                Object.keys(whichShapeSelectedRef.current).forEach((key) => {
                    if (whichShapeSelectedRef.current[key]) {
                        buttonRender(contextRef.current, style, buttonsImgDataRef.current, { select: true },
                            colorPaletteImgDataRef.current, colorsRef.current[0], key);
                    }
                })

            }


        }
        window.addEventListener("mousemove", handleMouseMoveWindow)

        const handleZoom = () => {
            setInnerHeight(window.innerHeight);
            setInnerWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleZoom);

        //cleanup the event handlers
        return () => {
            window.removeEventListener("mouseleave", handleMouseUpOrLeaveWindow);
            window.removeEventListener("mouseup", handleMouseUpOrLeaveWindow);
            window.removeEventListener("mousemove", handleMouseMoveWindow)
            window.removeEventListener("resize", handleZoom);
        }
    }, [])


    // onMouseMove is a mine
    return (
        <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave} />
    )
})
