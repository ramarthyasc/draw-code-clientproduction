import { useState, useRef, useEffect } from "react";
import type { SetStateAction, Dispatch } from "react";

export function useOneClickButton(sideEffectSetState: Dispatch<SetStateAction<boolean>>) {

    const [mouseDown, setMouseDown] = useState(false);
    const mouseDownButtonIdRef = useRef("");

    function handleMouseDown(e: React.MouseEvent<HTMLButtonElement>) {
        mouseDownButtonIdRef.current = e.currentTarget.id;
        setMouseDown(true);
    }
    function handleMouseUp(e: React.MouseEvent<HTMLButtonElement>) {
        if (mouseDown && mouseDownButtonIdRef.current === e.currentTarget.id) {
            // Data can be any state that is passed while calling the custom hook
            sideEffectSetState((val: boolean) => {
                return !val;
            });
        }
        setMouseDown(false);

    }

    useEffect(() => {
        function handleMouseUpWindow() {
            setMouseDown(false);
        }
        window.addEventListener("mouseup", handleMouseUpWindow);

        return () => {
            window.removeEventListener("mouseup", handleMouseUpWindow);
        }
    }, []);

    return { handleMouseDown, handleMouseUp };
}
