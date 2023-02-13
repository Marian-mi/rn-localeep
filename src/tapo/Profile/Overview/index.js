import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const ProfileOverview_Yalda = lazy(() => import('./Themes/Yalda'));

function ProfileOverviewScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.profileOverviewTheme;

    switch (themeName) {
      case 'Yalda':
        return <ProfileOverview_Yalda navigation={props.navigation} />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default ProfileOverviewScreen;
