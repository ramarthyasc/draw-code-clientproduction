//USAGE:  We can switch the "isActive" state between buttons when there are 2 or more buttons. 
// Use "useIsButtonActive" customhook to have the switching functionality.

export interface IActiveOrNotButtonProps {
    id: number;
    name: string;
    isActive: boolean;
    color: ButtonColors;
}
export type ButtonColors = "green" | "gray" | "amber" | "darkgreen" | "red" | "darkred";

export type ActiveOrNotButtonClass = {
    [key in ButtonColors]?: {
        active: string,
        inactive: string
    };
}

export interface IInteractionFunctions {
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IActiveOrNotButtonComponent {
    interactionFuncs?: IInteractionFunctions;
    buttonProps: IActiveOrNotButtonProps;
}
//USAGE:  We can switch the "isActive" state between buttons when there are 2 or more buttons. 
// Use "useIsButtonActive" customhook to have the switching functionality.
//
// TAILWIND WORKING ; IMPP
// Tailwind scans the source file at build time to create css files. So it has to see the "complete" classname as a 
// STRING (not variable concatenations or anything else) 
// - anywhere in the source code (in className or any manual objects) to create it's respective css file.

export function ActiveOrNotButton({ interactionFuncs, buttonProps}: IActiveOrNotButtonComponent) {

    const colorVariants: ActiveOrNotButtonClass = {
        green: {
            active: "bg-green-200 text-black hover:bg-green-200 hover:text-gray-800",
            inactive: "bg-green-50 text-black hover:bg-green-200 hover:text-gray-800",
        },

        gray: {
            active: "bg-gray-400 text-black hover:bg-gray-200 hover:text-gray-400",
            inactive: "bg-gray-200 text-black hover:bg-gray-300 hover:text-gray-200"
        },
        darkgreen: {
            active: "bg-green-300 text-black hover:bg-green-300 hover:text-gray-900",
            inactive: "bg-green-100 text-black hover:bg-green-300 hover:text-gray-900",
        },
        red: {
            active: "bg-red-200 text-black hover:bg-red-200 hover:text-gray-900",
            inactive: "bg-red-50 text-black hover:bg-red-50 hover:text-gray-900",
        },
        darkred: {
            active: "bg-red-300 text-black hover:bg-red-300 hover:text-gray-900",
            inactive: "bg-red-100 text-black hover:bg-red-300 hover:text-gray-900",
        }

    }

    return (
        <button type="button" data-id={buttonProps.id}
            onMouseDown={interactionFuncs?.onMouseDown} onMouseUp={interactionFuncs?.onMouseUp}
            className={`border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ${buttonProps.isActive ? (colorVariants[buttonProps.color]?.active ?? ""): (colorVariants[buttonProps.color]?.inactive ?? "")}`}
        >{buttonProps.name}</button>
    )
}
