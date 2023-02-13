import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const ProfileAddresses_Yalda = lazy(() => import('./Themes/Yalda'));

function ProfileAddressesScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.profileAddressesTheme;

    switch (themeName) {
      case 'Yalda':
        return <ProfileAddresses_Yalda navigation={props.navigation} />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default ProfileAddressesScreen;
