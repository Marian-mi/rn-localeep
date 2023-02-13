import React, { lazy, Suspense, useContext } from 'react';
import Loader from '../../Shared/loader';
import { ThemeContext } from '../../../appContext';

const Signup_Yalda = lazy(() => import('./Themes/Yalda'));

function SignupScreen(props) {
    const themeContext = useContext(ThemeContext);

    function FinalComponent() {
        let themeName = themeContext.signupTheme;

        switch (themeName) {
            case 'Yalda':
                return <Signup_Yalda />;
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <FinalComponent />
        </Suspense>
    );
}

export default SignupScreen;
