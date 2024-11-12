import React, {ReactNode,  useState,useEffect} from 'react'
import { getStorageValue, setStorageValue } from '../storage/storage';

    type AuthContextType = {
        isAuthenicated:boolean,
        logout: ()=> void,
        login:(data:{accessToken:string, refreshToken:string,username:string})=> void,
        username:string | null
        setUsername:Function


    } | null


    const AuthContext= React.createContext<AuthContextType>(null);

    const AuthProvider = ({ children }: { children: ReactNode })=> {
        const [isAuthenicated,setIsAuthenicated] = useState<boolean>(false)
        const [accessToken,setAccessToken] = useState<string | null>()
        const [refreshToken,setRefreshToken] = useState<string | null>()
        const [username,setUsername] = useState<string | null>(null)

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

        const login = (data:{accessToken:string, refreshToken:string,username:string}) => {
            setIsAuthenicated(true)
            setAccessToken(data.accessToken)
            setRefreshToken(data.refreshToken)
            setStorageValue("accessToken",data.accessToken)
            setStorageValue("refreshToken",data.refreshToken)
            setStorageValue("username",data.username)
            setUsername(data.username)

        }
        return <AuthContext.Provider value={{isAuthenicated,login,logout,username,setUsername}}>{children}</AuthContext.Provider>
    }

export {AuthProvider,AuthContext}
