// Copyright 2019-2022 @polkadot/extension-polkadot authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react/jsx-max-props-per-line */

import { Divider, Grid, SxProps, Theme } from '@mui/material';
import React from 'react';

import { BN } from '@polkadot/util';

import { useApi, useChain, useTranslation } from '../hooks';
import { ChainLogo, FormatBalance } from '.';

interface Props {
  address: string;
  amount: string | Element;
  children?: React.ReactNode;
  label: string;
  fee?: BN | undefined;
  style?: SxProps<Theme> | undefined;
  token?: string;
  showDivider?: boolean;
}

function AmountFee({ address, amount, children, fee, label, style = {}, showDivider = false, token }: Props): React.ReactElement {
  const { t } = useTranslation();
  const chain = useChain(address);
  const api = useApi(address);

  return (
    <Grid alignItems='center' container direction='column' justifyContent='center' sx={{ fontWeight: 300, letterSpacing: '-0.015em', ...style }}>
      <Grid item sx={{ fontSize: '16px' }}>
        {label}
      </Grid>
      <Grid alignItems='center' container item justifyContent='center' sx={{ lineHeight: '28px', pt: '5px' }}>
        <Grid alignItems='center' container item justifyContent='center' sx={{ fontSize: '28px', fontWeight: 400 }}>
          <Grid item>
            <ChainLogo genesisHash={chain?.genesisHash} size={31} />
          </Grid>
          <Grid item sx={{ fontSize: '26px', pl: '8px' }}>
            {amount} {token}
          </Grid>
        </Grid>
        {fee &&
          <Grid alignItems='center' container item justifyContent='center' >
            <Grid item>
              {t('Fee')}:
            </Grid>
            <Grid item sx={{ pl: '5px' }}>
              {api && <FormatBalance api={api} value={fee} />}
            </Grid>
          </Grid>
        }
      </Grid>
      {children}
      {showDivider &&
        <Divider sx={{ bgcolor: 'secondary.main', height: '2px', mt: '5px', width: '240px' }} />
      }
    </Grid>
  );
}

export default React.memo(AmountFee);