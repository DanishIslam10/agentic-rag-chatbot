import { useEffect } from "react";
import { useAuth, useUser } from '@clerk/react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function AuthSync() {

    const { isSignedIn, getToken } = useAuth();
    const { user, isLoaded } = useUser();

    const navigate = useNavigate();

    useEffect(() => {

        const syncUser = async () => {

            try {

                if (!isLoaded || !isSignedIn || !user) {
                    navigate("/");
                    return;
                }

                const token = await getToken();


                await axios.post(
                    `${import.meta.env.VITE_SERVER_ENDPOINT}/auth/sync`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                navigate("/chat");

            } catch (error) {
                console.log(error);
            }
        };

        syncUser();

    }, [isLoaded, isSignedIn]);

    return null;
}