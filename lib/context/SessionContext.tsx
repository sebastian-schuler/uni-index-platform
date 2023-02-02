import Cookies from 'js-cookie';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { INSTITUTION_SESSION_COOKIE } from '../config';

type authContextType = {
    token: string
    setAuthToken: (tokenValue: string, lifetime: Date) => void
    deleteAuthToken: () => void
};

const authContextDefaultValues: authContextType = {
    token: "",
    setAuthToken: () => { },
    deleteAuthToken: () => { },
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {

    const [token, setToken] = useState<string>("");

    const setAuthToken = (newToken: string, lifetime: Date) => {
        Cookies.set(INSTITUTION_SESSION_COOKIE, newToken, { expires: new Date(lifetime), secure: true, sameSite: "Lax" });
        setToken(newToken);
    };

    const deleteAuthToken = () => {
        Cookies.remove(INSTITUTION_SESSION_COOKIE, { sameSite: 'Lax' });
        setToken("");
    };

    const value = {
        token,
        setAuthToken,
        deleteAuthToken,
    };

    useEffect(() => {
        const cookie = Cookies.get(INSTITUTION_SESSION_COOKIE);
        if (cookie !== undefined) setToken(cookie);
        return () => { setToken(""); }
    }, [setToken]);

    return (
        <>
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        </>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}