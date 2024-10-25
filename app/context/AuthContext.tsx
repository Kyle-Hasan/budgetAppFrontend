import React, {ReactNode,  useState,useEffect} from 'react'
import { getStorageValue, setStorageValue } from '../storage/storage';

    type AuthContextType = {
        isAuthenicated:boolean,
        logout: ()=> void,
        login:(data:{accessToken:string, refreshToken:string})=> void


    } | null


    const AuthContext= React.createContext<AuthContextType>(null);

    const AuthProvider = ({ children }: { children: ReactNode })=> {
        const [isAuthenicated,setIsAuthenicated] = useState<boolean>(false)
        const [accessToken,setAccessToken] = useState<string | null>()
        const [refreshToken,setRefreshToken] = useState<string | null>()

         useEffect (()=> {
            const aToken = getStorageValue("accessToken")
            const rToken = getStorageValue("refreshToken")
            if(aToken && rToken) {
                setIsAuthenicated(true)
                setAccessToken(aToken)
                setRefreshToken(rToken)

            }

        })


        const logout = ()=> {
            setIsAuthenicated(false)
            setAccessToken(null)
            setRefreshToken(null)

        }

        const login = (data:{accessToken:string, refreshToken:string}) => {
            setIsAuthenicated(true)
            setAccessToken(data.accessToken)
            setRefreshToken(data.refreshToken)
            setStorageValue("accessToken",data.accessToken)
            setStorageValue("refreshToken",data.refreshToken)
        }
        return <AuthContext.Provider value={{isAuthenicated,login,logout}}>{children}</AuthContext.Provider>
    }

export {AuthProvider,AuthContext}
