import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../../appContext';
import Loader from '../../../Shared/loader';

const SecondStepVerification_Yalda = lazy(() => import('./Themes/Yalda'));

function SecondStepVerificationScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.verificationTheme;

    switch (themeName) {
      case 'Yalda':
        return <SecondStepVerification_Yalda />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default SecondStepVerificationScreen;
