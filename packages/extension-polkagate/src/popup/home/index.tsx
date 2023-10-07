// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react/jsx-max-props-per-line */

import { PoolService, PoolType, TradeRouter } from '@galacticcouncil/sdk';
import { Container, Grid, useTheme } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { AccountsStore } from '@polkadot/extension-base/stores';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { AccountContext, Warning } from '../../components';
import { useChainNames, useMerkleScience, usePrices, useTranslation } from '../../hooks';
import { tieAccount } from '../../messaging';
import HeaderBrand from '../../partials/HeaderBrand';
import { NEW_VERSION_ALERT, TEST_NETS } from '../../util/constants';
import AddAccount from '../welcome/AddAccount';
import AccountsTree from './AccountsTree';
import Alert from './Alert';
import YouHave from './YouHave';

export default function Home(): React.ReactElement {
  const { t } = useTranslation();
  const { accounts, hierarchy } = useContext(AccountContext);
  const chainNames = useChainNames();
  const theme = useTheme();

  usePrices(chainNames); // get balances for all chains available in accounts
  useMerkleScience(undefined, undefined, true); // to download the data file

  const [hideNumbers, setHideNumbers] = useState<boolean>();
  const [show, setShowAlert] = useState<boolean>(false);
  const [quickActionOpen, setQuickActionOpen] = useState<string | boolean>();
  const [hasActiveRecovery, setHasActiveRecovery] = useState<string | null | undefined>(); // if exists, include the account address

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const _testChain = 'wss://hydradx-rococo-rpc.play.hydration.cloud';
    const _mainChain = 'wss://rpc.hydradx.cloud';
    // Initialize Polkadot API
    const wsProvider = new WsProvider(_testChain);

    const api = await ApiPromise.create({ provider: wsProvider });
    // Initialize Trade Router
    const poolService = new PoolService(api);
    const tradeRouter = new TradeRouter(poolService, { includeOnly: [PoolType.Omni] });

    const assets = await tradeRouter.getAllAssets();// .then((assets) => {
    console.log('Assets on Omni Pool:', assets);

    const pools = await tradeRouter.getPools();
    console.log('pools on Omni Pool:', pools);

    const polkadotId = assets.find(({ symbol }) => symbol === 'DOT')?.id as string;
    const usdtId = assets.find(({ symbol }) => symbol === 'USDT')?.id as string;

    tradeRouter.getAssetPairs(polkadotId).then((AssetPairs) => { // DOT id is 5
      console.log('AssetPairs for Polkadot on Omni Pool:', AssetPairs);
    }).catch(console.error);

    tradeRouter.getAllPaths(polkadotId, usdtId).then((AllPaths) => {
      console.log('AllPaths from DOT to USDT on Omni Pool:', AllPaths);
    }).catch(console.error);

    tradeRouter.getPoolFees(polkadotId, usdtId).then((fee) => { //feeAsset: string, pool: Pool
      console.log('Fee from DOT to USDT on Omni Pool:', fee);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const isTestnetDisabled = window.localStorage.getItem('testnet_enabled') !== 'true';

    isTestnetDisabled && (
      accounts?.forEach(({ address, genesisHash }) => {
        if (genesisHash && TEST_NETS.includes(genesisHash)) {
          tieAccount(address, null).catch(console.error);
        }
      })
    );
  }, [accounts]);

  useEffect(() => {
    const value = window.localStorage.getItem(NEW_VERSION_ALERT);

    if (!value || (value && value !== 'ok')) {
      setShowAlert(true);
    }
  }, []);

  useEffect(() => {
    cryptoWaitReady().then(() => {
      keyring.loadAll({ store: new AccountsStore() });
    }).catch(() => null);
  }, []);

  const sortedAccount = useMemo(() =>
    hierarchy.sort((a, b) => {
      const x = a.name.toLowerCase();
      const y = b.name.toLowerCase();

      if (x < y) {
        return -1;
      }

      if (x > y) {
        return 1;
      }

      return 0;
    })
    , [hierarchy]);

  return (
    <>
      <Alert
        setShowAlert={setShowAlert}
        show={show}
      />
      {(hierarchy.length === 0)
        ? <AddAccount />
        : (
          <>
            <Grid padding='0px' textAlign='center' xs={12}>
              <HeaderBrand
                showBrand
                showMenu
                text={t<string>('Polkagate')}
              />
            </Grid>
            {hasActiveRecovery &&
              <Grid container item sx={{ '> div.belowInput .warningImage': { fontSize: '18px' }, '> div.belowInput.danger': { m: 0, position: 'relative' }, height: '55px', pt: '8px', width: '92%' }}>
                <Warning
                  fontSize='16px'
                  fontWeight={400}
                  isBelowInput
                  isDanger
                  theme={theme}
                >
                  {t<string>('Suspicious recovery detected on one or more of your accounts.')}
                </Warning>
              </Grid>
            }
            <YouHave
              hideNumbers={hideNumbers}
              setHideNumbers={setHideNumbers}
            />
            <Container
              disableGutters
              sx={[{
                m: 'auto',
                maxHeight: `${self.innerHeight - (hasActiveRecovery ? 220 : 165)}px`,
                mt: '10px',
                overflowY: 'scroll',
                p: 0,
                width: '92%'
              }]}
            >
              {sortedAccount.map((json, index): React.ReactNode => (
                <AccountsTree
                  {...json}
                  hideNumbers={hideNumbers}
                  key={`${index}:${json.address}`}
                  quickActionOpen={quickActionOpen}
                  setHasActiveRecovery={setHasActiveRecovery}
                  setQuickActionOpen={setQuickActionOpen}
                />
              ))}
            </Container>
          </>
        )
      }
    </>
  );
}
