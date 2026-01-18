import type { ButtonColors, IInteractionFunctions } from "./ActiveOrNotButton";

export interface IOneClickButtonProps {
    id: string;
    name: string;
    color: ButtonColors;
    type?: "submit" | "reset" | "button" | undefined;
}

export type OneClickButtonClass = {
    [key in ButtonColors]?: {
        normal: string,
    };
}
interface IOneClickButtonComponent {
    interactionFuncs?: IInteractionFunctions;
    buttonProps: IOneClickButtonProps;
}

export function OneClickButton({ interactionFuncs, buttonProps }: IOneClickButtonComponent) {
    const colorVariants: OneClickButtonClass = {
        gray: {
            normal: "bg-gray-300 text-black hover:bg-gray-200 hover:text-gray-400 active:text-gray-400\
            active:bg-gray-600",
        },
        amber: {
            normal: `bg-amber-500 text-black hover:bg-amber-400 hover:text-gray-800 active:text-gray-800 
            active:bg-amber-600`
        },
        green: {
            normal: `bg-green-300 text-black hover:bg-green-200 hover:text-gray-900 active:text-gray-900
            active:bg-green-400`
        }
    }

    return (

        <button id={buttonProps.id} type={buttonProps.type} onMouseDown={interactionFuncs?.onMouseDown} 
        onMouseUp={interactionFuncs?.onMouseUp}
            className={`border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants[buttonProps.color]?.normal}`}
            >{buttonProps.name}</button>
    )
}
