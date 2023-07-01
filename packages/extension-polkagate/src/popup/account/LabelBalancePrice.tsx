// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

/**
 * @description
 * this component shows an account information in detail
 * */

import { Divider, Grid, Skeleton } from '@mui/material';
import React, { useMemo } from 'react';

import { ShowBalance } from '../../components';
import { useApi, useDecimal, usePrice, useToken } from '../../hooks';
import { BalancesInfo } from '../../util/types';
import { getValue } from './util';

interface Props {
  label: string;
  balances: BalancesInfo | null | undefined;
  address: string | undefined;
  showLabel?: boolean;
}

export default function LabelBalancePrice({ address, balances, label, showLabel = true }: Props): React.ReactElement<Props> {
  const value = getValue(label, balances);
  const api = useApi(address);
  const price = usePrice(address);
  const decimal = useDecimal(address);
  const token = useToken(address);

  const balanceInUSD = useMemo(() =>
    price && value && balances?.decimal &&
    Number(value) / (10 ** balances.decimal) * price.amount
    , [balances?.decimal, price, value]);

  return (
    <>
      <Grid item py='4px'>
        <Grid alignItems='center' container justifyContent='space-between'>
          {showLabel &&
            <Grid item sx={{ fontSize: '16px', fontWeight: 300, lineHeight: '36px' }} xs={6}>
              {label}
            </Grid>
          }
          <Grid alignItems='flex-end' container direction='column' item xs>
            <Grid item sx={{ fontSize: '20px', fontWeight: 400, lineHeight: '20px' }} textAlign='right'>
              <ShowBalance api={api} balance={value} decimal={decimal} decimalPoint={2} token={token} />
            </Grid>
            <Grid item pt='6px' sx={{ fontSize: '16px', fontWeight: 300, letterSpacing: '-0.015em', lineHeight: '15px' }} textAlign='right'>
              {balanceInUSD !== undefined
                ? `$${Number(balanceInUSD)?.toLocaleString()}`
                : <Skeleton height={15} sx={{ display: 'inline-block', fontWeight: 'bold', transform: 'none', width: '90px' }} />
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {showLabel &&
        <Divider sx={{ bgcolor: 'secondary.main', height: '1px', my: '5px' }} />
      }
    </>
  );
}
