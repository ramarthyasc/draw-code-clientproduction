import { useId, useRef } from "react"
import "../styles/ButtonComponent.css"
import { useContext } from "react";
import { QuestionContext } from "../context/QuestionContext";

export function ButtonComponent(props) {
  const { isCoding, setIsCoding } = useContext(QuestionContext);

  const buttonId = useId();
  const mouseDownRef = useRef(false);
  const buttonSelectedRef = useRef(false);

  function handleMouseDown() {
    window.getSelection().removeAllRanges();
    mouseDownRef.current = true;
    document.getElementById(buttonId).className = "button-general button-highlight";
    props.buttonSpecial && document.getElementById(buttonId).classList.add(props.buttonSpecial); // for code-Button

  }
  function handleMouseUp() {

    if (props.buttonName === "Question") {
      // change the question component using a state
      // turn all other selected buttons to normal

    } else if (props.buttonName === "Solution") {
      //...
      // turn all other selected buttons to normal
    }

    if (mouseDownRef.current) {

      mouseDownRef.current = false;

      //for code-button
      if (props.buttonSpecial) {
        document.getElementById(buttonId).className = `${props.buttonSpecial} button-general button-normal`; // for code-Button
        if (!isCoding) {
          setIsCoding(true);
        } else {
          setIsCoding(false);
        }
        return;
      }

      if (buttonSelectedRef.current) {
        document.getElementById(buttonId).className = "button-general button-normal";
        buttonSelectedRef.current = false;
      } else {
        document.getElementById(buttonId).className = "button-general button-select";
        buttonSelectedRef.current = true;
      }
    }
  }

  function handleMouseLeave() {
    if (mouseDownRef.current) {
      mouseDownRef.current = false;
    }

    //for code-button
    if (props.buttonSpecial) {
      document.getElementById(buttonId).className = `${props.buttonSpecial} button-general button-normal`; // for code-Button
      return;
    }

    if (!buttonSelectedRef.current) {
      document.getElementById(buttonId).className = "button-general button-normal";
    } else {
      document.getElementById(buttonId).className = "button-general button-select";
    }
  }

  return (
    <div id={buttonId} className={"button-general " + (props.buttonSpecial ? "button-normal " + props.buttonSpecial : "button-normal")}
      onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp}>{props.buttonName}</div>

  )
}
