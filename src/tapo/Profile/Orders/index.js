import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const Orders_Yalda = lazy(() => import('./Themes/Yalda'));

function OrdersScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.orderTheme.main;

    switch (themeName) {
      case 'Yalda':
        return <Orders_Yalda navigation={props.navigation} />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default OrdersScreen;
