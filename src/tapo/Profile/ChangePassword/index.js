import React, { lazy, Suspense, useContext } from 'react';
import { ThemeContext } from '../../../appContext';
import Loader from '../../Shared/loader';

const ChangePassword_Yalda = lazy(() => import('./Themes/Yalda'));

function ChangePasswordScreen(props) {
    const themeContext = useContext(ThemeContext);

    function FinalComponent() {
        let themeName = themeContext.changePasswordTheme;

        switch (themeName) {
            case 'Yalda':
                return <ChangePassword_Yalda />;
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <FinalComponent />
        </Suspense>
    );
}

export default ChangePasswordScreen;
