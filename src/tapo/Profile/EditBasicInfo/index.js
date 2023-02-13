import React, { lazy, Suspense, useContext } from 'react';
import Loader from '../../Shared/loader';
import { ThemeContext } from '../../../appContext';

const EditBasicInfo_Yalda = lazy(() => import('./Themes/Yalda'));

function EditBasicInfoScreen(props) {
    const themeContext = useContext(ThemeContext);

    function FinalComponent() {
        let themeName = themeContext.editBasicInfoTheme;

        switch (themeName) {
            case 'Yalda':
                return <EditBasicInfo_Yalda />;
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <FinalComponent />
        </Suspense>
    );
}

export default EditBasicInfoScreen;
