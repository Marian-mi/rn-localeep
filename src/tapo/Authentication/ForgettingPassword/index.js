import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const ForgettingPassword_Yalda = lazy(() => import('./Themes/Yalda'));

function ForgettingPasswordScreen() {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.forgettingPasswordTheme;

    switch (themeName) {
      case 'Yalda':
        return <ForgettingPassword_Yalda />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default ForgettingPasswordScreen;
