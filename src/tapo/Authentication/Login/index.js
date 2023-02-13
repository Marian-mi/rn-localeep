import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const Login_Yalda = lazy(() => import('./Themes/Yalda'));

function LoginScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.homeTheme;

    switch (themeName) {
      case 'Yalda':
        return <Login_Yalda />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default LoginScreen;
