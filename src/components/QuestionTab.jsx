// import '../styles/QuestionTab.css';
import { useContext } from 'react';
import { Question } from '../components/Question.jsx';
import { ButtonTab } from './ButtonTab.jsx';
import { QuestionContext } from '../context/QuestionContext.js';

export function QuestionTab() {
    const { qDetailsQNextPrev } = useContext(QuestionContext);

    return (
        <div className="flex flex-col flex-1 font-jet-brains h-[calc(100vh-50px)]" >
            <ButtonTab />
            <Question qDetailsQNextPrev={qDetailsQNextPrev} />
        {/* Shortcuts */}
            <div className='flex border mb-1 mx-2 pl-4 items-center justify-start'>
                <div className='text-center font-bold text-blue-700 bg-amber-200 px-2 mr-2 my-1 rounded-md text-sm'>
                    CANVAS VIM:
                </div>
                <div className='text-sm mx-2'>
                    Undo: <br/>Ctrl-Z
                </div>
                <div className='text-sm mx-1'>
                    Redo: <br/>Ctrl-X
                </div>
                <div className='text-sm mx-2'>
                    <strong>Fast shapes (L-hand)</strong>: <br />Ctrl-A/S/D/F
                </div>
            </div>
        </div>
    )
}
