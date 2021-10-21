import { createContext, ReactNode, useEffect, useState } from 'react';

// database
import { COLLECTION_TOKEN_GITHUB } from '../configs/database';

// service
import { api } from '../services/api';

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInURl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export function AuthProvider(props: AuthProvider) {

    const [user, setUser] = useState<User | null>(null);

    const signInURl = `https://github.com/login/oauth/authorize?scope=user&client_id=aae3d313be307fab2c78`;

    async function signIn(githubCode: string) 
    {
        const response = await api.post<AuthResponse>('/authenticate', {
            code: githubCode
        });

        const { token, user } = response.data;

        localStorage.setItem(COLLECTION_TOKEN_GITHUB, token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;
        
        setUser(user);
    }

    function signOut() {
        setUser(null);
        localStorage.removeItem(COLLECTION_TOKEN_GITHUB);
    }

    useEffect(() => {
        const token = localStorage.getItem(COLLECTION_TOKEN_GITHUB);

        if( token ){
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data);
            })
        }
    }, []);

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if( hasGithubCode ) {
            const [urlWithoutCode, githubCode] = url.split('?code=');

            window.history.pushState({}, '', urlWithoutCode);

            signIn(githubCode);
        }
    }, []);

    return(
        <AuthContext.Provider
            value={{
                user,
                signInURl,
                signOut
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

