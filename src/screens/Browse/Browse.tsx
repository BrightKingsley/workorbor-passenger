import * as React from 'react';

import {Text, View} from '#/components/Themed';
import ViewHeader from '#/components/ViewHeader';
import {useAppDispatch} from '#/hooks/store';
import {a} from '#/lib/style/atoms';
import Layout from '#/lib/utils/Layout';

export default function OrdersScreen() {
  const dispatch = useAppDispatch();

  return (
    <Layout>
      <ViewHeader canGoBack={false} title="Orders" hasRightComponent={false} />
      <View style={[a.h_full]}>
        <Text>Browse</Text>
      </View>
    </Layout>
  );
}
