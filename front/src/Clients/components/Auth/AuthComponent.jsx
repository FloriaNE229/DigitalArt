import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuthHook";

const AuthComponent = ({children})=>{

    const {pathname} = useLocation()
    const {Loading, user} = useAuth();
    if (Loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <span className="ml-3">Vérification de la session...</span>
            </div>
        )
    }
    else {

        if(user === null){
            return <Navigate to={`/login?redirect=${pathname}`} replace />;
        }
    }
    return children;
}
export default AuthComponent;