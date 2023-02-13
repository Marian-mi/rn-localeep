import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const ProfileFavorites_Yalda = lazy(() => import('./Themes/Yalda'));

function ProfileFavoritesScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.profileFavoritesTheme;

    switch (themeName) {
      case 'Yalda':
        return <ProfileFavorites_Yalda />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default ProfileFavoritesScreen;
