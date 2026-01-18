import { useEffect, useRef } from "react";

export function HorizVertSlider(props) {
    const isMouseDownRef = useRef();
    const mouseDownCoordRef = useRef([]);
    //for horizontal adjustment
    const heightRef = useRef();
    //for vertical adjustment
    const widthRef = useRef();
    const isRegisteredRef = useRef(false);


    function handleMouseDown({ nativeEvent }) {
        if (nativeEvent.button !== 0) return;
        const { clientX, clientY } = nativeEvent;
        mouseDownCoordRef.current = [clientX, clientY];
        window.getSelection().removeAllRanges();
        isMouseDownRef.current = true;

        //styles
        if (props.resultBoxRef) {
            document.body.classList.add("bg-amber-500", "cursor-ns-resize!");
        } else if (props.codespaceRef) {
            document.body.classList.add("bg-amber-500", "cursor-ew-resize!");
        }
    }

    function handleMouseUp() {
        // This only for removing all selections of texts
        window.getSelection().removeAllRanges();
    }

    useEffect(() => {
        if (props.resultBoxRef) {
            const resultBoxStyle = getComputedStyle(props.resultBoxRef.current);
            heightRef.current = parseFloat(resultBoxStyle.height);

        } else if (props.codespaceRef) {
            const codespaceStyle = getComputedStyle(props.codespaceRef.current);
            widthRef.current = parseFloat(codespaceStyle.width);
        }

        function handleMouseUpWindow() {
            isMouseDownRef.current = false;

            requestAnimationFrame(() => {
                if (props.resultBoxRef) {
                    const resultBoxStyle = getComputedStyle(props.resultBoxRef.current);
                    heightRef.current = parseFloat(resultBoxStyle.height);

                } else if (props.codespaceRef) {
                    const codespaceStyle = getComputedStyle(props.codespaceRef.current);
                    widthRef.current = parseFloat(codespaceStyle.width);
                }
            })

            //styles
            if (props.resultBoxRef) {
                document.body.classList.remove("bg-amber-500", "cursor-ns-resize!");
            } else if (props.codespaceRef) {
                document.body.classList.remove("bg-amber-500", "cursor-ew-resize!");
            }

        }
        window.addEventListener("mouseup", handleMouseUpWindow);

        function handleMouseMoveWindow(e) {
            const { clientX, clientY } = e;

            if (isMouseDownRef.current) {
                // for Horizontal slider
                if (props.resultBoxRef) {
                    if (!isRegisteredRef.current) {
                        //register the callback function of requestAnimationFrame to run just before paint
                        requestAnimationFrame(() => {
                            props.resultBoxRef.current.style.height = ((heightRef.current - (clientY - mouseDownCoordRef.current[1])) + "px");
                            isRegisteredRef.current = false;

                            if (parseFloat(props.resultBoxRef.current.style.height) >= 784) {
                                props.resultBoxRef.current.style.height = 784 + "px";
                            }
                        })
                        isRegisteredRef.current = true;

                    }

                    // for Vertical slider
                    //
                } else if (props.codespaceRef) {
                    if (!isRegisteredRef.current) {
                        // register the callback function
                        requestAnimationFrame(() => {
                            props.codespaceRef.current.style.width = ((widthRef.current - (clientX - mouseDownCoordRef.current[0])) + "px");
                            isRegisteredRef.current = false;
                        })
                        isRegisteredRef.current = true;
                    }
                }
            }
        }
        window.addEventListener("mousemove", handleMouseMoveWindow);

        return () => {
            window.removeEventListener("mouseup", handleMouseUpWindow)
            window.removeEventListener("mousemove", handleMouseMoveWindow)
        }

    }, []);


    return (
        <div onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp} className={`${props.resultBoxRef ? "h-3 hover:cursor-ns-resize" : "w-3 hover:cursor-ew-resize"} shrink-0 bg-orange-300 hover:bg-amber-500 border border-solid border-black `} >
        </div >
    )
}
