import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'

// Pages List
import Homepage from "./components/homepage/Homepage";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepository from "./components/repository/CreateRepository";
import RepositoryView from "./components/repository/RepositoryView";
import EditRepository from "./components/repository/EditRepository";
import RepositorySettings from "./components/repository/RepositorySettings";
import RepositoriesList from "./components/repository/RepositoriesList";
import IssuesList from "./components/issues/IssuesList";

// Footer Pages
import Terms from "./components/pages/Terms";
import Privacy from "./components/pages/Privacy";
import Security from "./components/pages/Security";
import Status from "./components/pages/Status";
import Docs from "./components/pages/Docs";
import Contact from "./components/pages/Contact";

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && userIdFromStorage !== 'null' && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        // If user logged out (no userId in storage but currentUser exists), clear currentUser
        if(!userIdFromStorage && currentUser){
            setCurrentUser(null);
        }

        const publicPaths = ["/", "/auth", "/signup", "/repositories", "/issues", "/terms", "/privacy", "/security", "/status", "/docs", "/contact"];
        const isPublicPath = publicPaths.includes(window.location.pathname) || window.location.pathname.startsWith("/repository/");

        // Don't redirect from homepage if not logged in - let them see the landing page
        if(!userIdFromStorage && !isPublicPath)
        {
            navigate("/");
        }

        if(userIdFromStorage && userIdFromStorage !== 'null' && window.location.pathname=='/auth'){
            navigate("/dashboard");
        }
    }, [currentUser, navigate, setCurrentUser]);

    // Determine if user is logged in
    const userIdFromStorage = localStorage.getItem("userId");
    const isLoggedIn = userIdFromStorage && userIdFromStorage !== 'null' && currentUser;

    let element = useRoutes([
        {
            path:"/",
            element: isLoggedIn ? <Dashboard/> : <Homepage/>
        },
        {
            path:"/dashboard",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/create",
            element:<CreateRepository/>
        },
        {
            path:"/repositories",
            element:<RepositoriesList/>
        },
        {
            path:"/issues",
            element:<IssuesList/>
        },
        {
            path:"/repository/:id",
            element:<RepositoryView/>
        },
        {
            path:"/repository/:id/edit",
            element:<EditRepository/>
        },
        {
            path:"/repository/:id/settings",
            element:<RepositorySettings/>
        },
        {
            path:"/terms",
            element:<Terms/>
        },
        {
            path:"/privacy",
            element:<Privacy/>
        },
        {
            path:"/security",
            element:<Security/>
        },
        {
            path:"/status",
            element:<Status/>
        },
        {
            path:"/docs",
            element:<Docs/>
        },
        {
            path:"/contact",
            element:<Contact/>
        }
    ]);

    return element;
}

export default ProjectRoutes;