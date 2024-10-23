import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

export const setStorageValue = (key:string,value:string)  => {
    if(Platform.OS == "web") {
        localStorage.setItem(key,value)
    }
    else {
        SecureStore.setItem(key,value)
    }
}


export const getStorageValue = (key:string):string | null => {
    if(Platform.OS == 'web') {
        return localStorage.getItem(key)
    }
    else {
        return SecureStore.getItem(key)
    }
}