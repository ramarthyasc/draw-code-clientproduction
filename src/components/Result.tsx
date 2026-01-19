function jsxStringLogger(input: unknown) {
    if (typeof input === "boolean" ||
        typeof input === "number" ||
        typeof input === "string" ||
        Object.prototype.toString.call(input) === "[object Null]"
    ) {
        return `${input}`;
    } else if (typeof input === "undefined") {
        return `undefined`;
    } else if (typeof input === "function") {
        return `function`;
    }
    else if (
        Object.prototype.toString.call(input) === "[object Array]" ||
        Object.prototype.toString.call(input) === "[object Object]"
    ) {
        // json.stringify removes functions and undefined inside the array or object
        return JSON.stringify(input);
    }
}

export function Result({ result }: any) {
    if (!result) { return; };  // Need this

    const resultObject = result.at(-1);
    const userlogArray = result.slice(0, -1);

    return (
        <div className="mx-2 text-gray-900">
            <div> Input: </div>
            <div className="my-2 py-2 px-2 rounded-md bg-gray-200"> {jsxStringLogger(resultObject.input)} </div>
            <div> My Output: </div>
            <div className="my-2 py-2 px-2 rounded-md bg-gray-200"> {jsxStringLogger(resultObject.userOutput)} </div>
            <div> Expected Output: </div>
            <div className="my-2 py-2 px-2 rounded-md bg-gray-200"> {jsxStringLogger(resultObject.expOutput)} </div>
            {userlogArray.length ?
                <div>
                    <hr className="mt-6 mb-4 text-gray-400"/>
                    <div >
                        Logs:
                    </div>
                    <div className="my-2 py-2 px-2 rounded-md bg-gray-200">
                        {
                            userlogArray.map((log: string, i: number) => {
                                return (
                                    <div key={i}>
                                        {jsxStringLogger(log)}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div> :
                <div>
                </div>}

        </div>

    )
}
