import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import { useMyContext } from "../contexts/StateHolder";
import { authenticateUser, registerUser } from "../scripts/dataHandlers";
import { useHistory } from 'react-router-dom';

// First create the context to hold shared functions
const MyContextFunctions = React.createContext();

// Then create a ContextFunctions wrapper component
// to hold the shared functions that the components need.
const ContextFunctions = (props) => {

    // Bring stateholders from another context
    const { organizationId, setUser, setGoBackToPrevious } = useMyContext();

    const [cookies, setCookie] = useCookies("");

    const history = useHistory();

    const authProcess = async (email, password) => {
        try {
            const authResponse = await authenticateUser(organizationId, email, password);

            if (authResponse.data.status === "error") {
                // Give error message to user
            } else if (authResponse.data.status === "ok") {
                let newUser = {
                    userId: authResponse.data.user_id,
                    userToken: authResponse.data.user_token,
                    firstName: authResponse.data.user_name,
                    eMail: email,
                    loggedIn: true
                }

                // Update user state
                setUser(newUser);

                // Set userToken in cookies
                setCookie('userData',
                    {
                        userId: authResponse.data.user_id,
                        userToken: authResponse.data.user_token,
                    }, {
                    path: '/',
                    Secure: true,
                    SameSite: "none"
                });
            }

            console.log(authResponse);
            return authResponse;
        } catch (err) {
            console.log(err);
            console.log(cookies);
        }
    };

    const registerProcess = async (inputs) => {
        try {
            const response = await registerUser(organizationId, inputs);

            return response;
        } catch (err) {
            console.log(err);
        }
    };

    const redirectUserToLogin = async (loginRoute) => {

        const currentPath = window.location.pathname;

        // If user isnt already on loginRoute
        if (currentPath !== loginRoute) {
            console.log(currentPath);
            // Set current route in context
            setGoBackToPrevious(true);
            // Push user to defined loginRoute
            history.push(`/${loginRoute}`);
        }
    };

    return (
        <MyContextFunctions.Provider value={{
            authProcess,

            registerProcess,

            redirectUserToLogin
        }}>
            {props.children}
        </MyContextFunctions.Provider>
    );
};

export const useMyContextFunctions = () => useContext(MyContextFunctions);

export default ContextFunctions;
