import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../../appContext';
import Loader from '../../../Shared/loader';

const FirstStepVerification_Yalda = lazy(() => import('./Themes/Yalda'));

function FirstStepVerificationScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.verificationTheme;

    switch (themeName) {
      case 'Yalda':
        return <FirstStepVerification_Yalda />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default FirstStepVerificationScreen;
