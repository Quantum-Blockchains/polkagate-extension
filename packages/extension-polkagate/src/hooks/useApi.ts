// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext, useEffect, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { AccountId } from '@polkadot/types/interfaces/runtime';

import { APIContext } from '../components';
import { useChain, useEndpoint2 } from '.';

export default function useApi(address: AccountId | string | undefined, stateApi?: ApiPromise): ApiPromise | undefined {
  const endpoint = useEndpoint2(address);
  const apisContext = useContext(APIContext);
  const chain = useChain(address);

  const [api, setApi] = useState<ApiPromise | undefined>(stateApi);

  useEffect(() => {
    if (api?.isConnected || !chain?.genesisHash) {
      return;
    }

    if (apisContext?.apis[chain.genesisHash]) {
      const savedApi = apisContext.apis[chain.genesisHash].api;

      if (savedApi?.isConnected) {
        console.log(`♻ using the saved api for ${chain.name}`);

        return setApi(savedApi);
      }
    }

    if (!endpoint || apisContext?.apis[String(chain.genesisHash)]?.isRequested) {
      console.log(' APi is already requested, wait ... ))');
      return;
    }

    console.log(' I passed the barrier  .... ))');

    apisContext.apis[chain.genesisHash] = { isRequested: true };
    apisContext.setIt(apisContext.apis);
    
    const wsProvider = new WsProvider(endpoint);

    ApiPromise.create({ provider: wsProvider }).then((api) => {
      console.log(' my mission is completed .... ))');

      setApi(api);

      apisContext.apis[String(api.genesisHash.toHex())] = { api, endpoint, isRequested: false };
      apisContext.setIt(apisContext.apis);
    }).catch(console.error);
  }, [apisContext, endpoint, stateApi, chain, api?.isConnected]);

  return api;
}
