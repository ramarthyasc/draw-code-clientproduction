import { useOutletContext } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { QuestionTab } from '../components/QuestionTab';
import Slider from '../components/Slider';
import '../styles/Drawboard.css';
import { useRef, useState, useEffect, useMemo } from 'react';
import { QuestionContext } from '../context/QuestionContext';
import { CodeSpace } from '../components/CodeSpace';
import { HorizVertSlider } from '../components/HorizVertSlider.jsx';
import { useParams } from 'react-router-dom';

function Drawboard() {
    const { setIsAdmin } = useOutletContext();

    const canvasRef = useRef();
    const codespaceRef = useRef();
    const [canvasEdgeMotionCoord, setCanvasEdgeMotionCoord] = useState(null);

    const [isCoding, setIsCoding] = useState(false);
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [qDetailsQNextPrev, setQDetailsQNextPrev] = useState();
    const [error, setError] = useState();
    // reference of the context object passed shouldn't change in each render - preventing context child 
    // rerender in each render of parent
    const providerValue = useMemo(() => {
        return { isCoding, setIsCoding, qDetailsQNextPrev };
    }, [isCoding, qDetailsQNextPrev])

    useEffect(() => {
        // one controller for each request - controller is linked to the specific request
        const controller = new AbortController();

        async function questionDetailsFetcher() {

            try {
                let res = await fetch(`/docs/questions/${params.qname}`, {
                    method: "GET",
                    credentials: 'include',
                    signal: controller.signal,
                });

                if (res.ok) {
                    const qDetails = await res.json();
                    setQDetailsQNextPrev(qDetails);
                    setIsLoading(false);
                } else {
                    setError(new Error(`Request failed with status: ${res.status}`));
                    return;
                }
            } catch (err) {
                if (err.name === "AbortError") {
                    // Intentional error. So don't setError here
                } else {
                    setError(err);
                }
            }
        }

        questionDetailsFetcher();
        setIsAdmin(false);

        return () => {
            controller.abort();
        }

    }, [params.qname]);

    if (error) {
        throw error;
    }

    if (isLoading) {
        return (
            <div className="text-center">
                loading...
            </div>
        )
    }


    return (
        <>
            <div className='space'>
                <QuestionContext.Provider value={providerValue} >
                    <QuestionTab />

                    {!isCoding ? (
                        <>
                            <Slider canvasRef={canvasRef} setCanvasEdgeMotionCoord={setCanvasEdgeMotionCoord} />
                            <Canvas ref={canvasRef} canvasEdgeMotionCoord={canvasEdgeMotionCoord} />
                        </>) : (
                        <>
                            <HorizVertSlider codespaceRef={codespaceRef} />
                            <CodeSpace ref={codespaceRef} />

                        </>
                    )}

                </QuestionContext.Provider>
            </div>
        </>
    )




}

export default Drawboard;
