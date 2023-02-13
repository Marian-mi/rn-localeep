import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const ProfileScores_Yalda = lazy(() => import('./Themes/Yalda'));

function ProfileScoresScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.profileScoresTheme;

    switch (themeName) {
      case 'Yalda':
        return <ProfileScores_Yalda navigation={props.navigation} />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default ProfileScoresScreen;
