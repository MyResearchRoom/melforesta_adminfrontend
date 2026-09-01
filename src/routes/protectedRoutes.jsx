import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute=({user,element,allowedRole})=>{

    if(!user){
        return <Navigate to="/login" replace={true} />
    }
    
    if(allowedRole.includes(user.role)){
        return element ? element : <Outlet />
    }
    else {
        return <Navigate to="/unauthorized" replace />
    }
}

export default ProtectedRoute;
