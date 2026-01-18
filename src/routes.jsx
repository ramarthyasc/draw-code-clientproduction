import Home from './pages/Home.jsx'
import Drawboard from './pages/Drawboard.jsx';
import App from './App.jsx'
import AdminQuestionDetail from './components/AdminQuestionDetail.js';
import AdminQuestionsList from './components/AdminQuestionsList.js';
import AdminQuestionTemplate from './components/AdminQuestionTemplate.js';

//MANAGE ALL YOUR ROUTES HERE : THIS IS THE WHOLE WEBSITE WORKING FLOW :

// Keywords : path, element, children in an object-> that's it
const routes = [
    // NOTE:  The Parent element always render again (From the root itself) when the user routes to any of it's children (all nested children too).
    // So here, JwtAuthorizedRoutes component runs each time a child path is triggered. So we get secure routes.
    {
        path: "/",
        element: <App />, // Navigation bar
        // Children are the things that are presented in the <Outlet/>
        children: [

            {
                index: true,
                element: <Home />
            }, //index: true - means it takes the same path as parent App component
            {
                path: "draw-code",
                children: [
                    {
                        path: ":qname",
                        element: <Drawboard />
                    }
                ]
            },
            {
                path: "admin",
                children: [
                    {
                        path: "question-list",
                        element: <AdminQuestionsList />
                    },
                    {
                        path: "question-detail",
                        children: [
                            {
                                path: ":qname",
                                element: <AdminQuestionDetail />
                            }
                        ]
                    },
                    {
                        path: "question-template",
                        children: [
                            {
                                path: ":qname",
                                element: <AdminQuestionTemplate />
                            }
                        ]
                    },
                ]
            },
            {
                path: "*",
                element: <div className="text-center">
                Page not found !
                </div>
            }
        ]
    },
]

export default routes;
