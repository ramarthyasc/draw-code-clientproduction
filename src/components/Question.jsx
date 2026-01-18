
export function Question(props) {
    const question = props.qDetailsQNextPrev.questionDetails;
    const colorMap = {
        easy: "text-green-500",
        medium: "text-orange-600",
        hard: "text-red-700"
    }
    return (
        <div className="flex-2 p-4 text-left overflow-y-auto border-black border-solid border-t-0 border-x border-b mx-3 mt-0 mb-2">
            <h2 className="text-gray-800 font-extrabold text-2xl mb-2">{question.title}</h2>
            <p className={`${colorMap[question.difficulty]} font-bold bg-gray-200 inline-block px-2 py-1 rounded-lg mb-2`} >{question.difficulty}</p>
            <br />
            <p className="whitespace-pre-line" >{question.description}</p>

            {/* Examples */}
            <ul className="my-2">
                {question.examples.length !== 0 ? question.examples.map((example) => {
                    return (
                        <li key={example.id} >
                            <h4 className="font-bold my-2 ">{example.title}:</h4>
                            <div className="p-2 bg-[#FAFAD2]">
                                <p><span className="text-green-700">Input</span>: {example.input}</p>
                                <p><span className="text-green-700">Output</span>: {example.output}</p>
                            </div>
                            {example.explanation.length !== 0 ? <p className="whitespace-pre-line"><span className="text-gray-700">Explanation:</span>{"\n"} {example.explanation}</p> : <p></p>}
                        </li>
                    )
                }) : <p></p>}
            </ul>

            <h4 className="font-bold mt-8">Constraints:</h4>
            <ul className="mx-6 list-disc">
                {/* Constraints */}
                {question.constraints.map((constraint, index) => {
                    // here i gave index, because the whole thing will be anyway remounted when i change the question
                    return (
                        <li key={index}>
                            {constraint}
                        </li>
                    )
                })}
            </ul>

            <br />
            {/* Tips */}
            <ul className="mt-12">
                {question.tips.map((tip, index) => {
                    return (
                        <li className="border-t border-solid border-black my-2 pt-1" key={index}>
                            <details>
                                <summary className="hover:text-gray-600 cursor-pointer">{tip.title}</summary>
                                <p style={{ paddingTop: "10px" }}>{tip.description}</p>
                            </details>
                        </li>
                    )
                })}
            </ul>

        </div>
    )
}
