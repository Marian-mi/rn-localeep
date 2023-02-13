import React, {lazy, Suspense, useContext} from 'react';
import {ThemeContext} from '../../../appContext';
import Loader from '../../Shared/loader';

const OrderDetails_Yalda = lazy(() => import('./Themes/Yalda'));

function OrderDetailsScreen(props) {
  const themeContext = useContext(ThemeContext);

  function FinalComponent() {
    let themeName = themeContext.orderDetailsTheme;

    switch (themeName) {
      case 'Yalda':
        return <OrderDetails_Yalda navigation={props.navigation} />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <FinalComponent />
    </Suspense>
  );
}

export default OrderDetailsScreen;
