// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

/**
 * @description
 * this component shows an account information in detail
 * */

import { ArrowForwardIosRounded as ArrowForwardIosRoundedIcon } from '@mui/icons-material';
import { Divider, Grid, IconButton, useTheme } from '@mui/material';
import React from 'react';

import { FormatPrice, ShowBalance } from '../../components';
import { useApi, usePrice } from '../../hooks';
import { BalancesInfo } from '../../util/types';
import { getValue } from './util';

interface Props {
  label: string;
  balances: BalancesInfo | null | undefined;
  address: string | undefined;
  showLabel?: boolean;
  onClick?: () => void
}

export default function LabelBalancePrice({ address, balances, label, onClick, showLabel = true }: Props): React.ReactElement<Props> {
  const theme = useTheme();
  const value = getValue(label, balances);
  const api = useApi(address);
  const price = usePrice(address);

  return (
    <Grid alignItems='center' container item justifyContent='space-between' sx={{ bgcolor: 'background.paper', mx: '15px', border: ` 1px solid ${theme.palette.secondary.main}`, px: '10px', py: '13px', borderRadius: '5px', mt: '4px', width: '92%' }}>
      {showLabel &&
        <Grid item sx={{ fontSize: '16px', fontWeight: 300, lineHeight: '36px' }} xs={5.5}>
          {label}
        </Grid>
      }
      <Grid alignItems='flex-end' container direction='column' item xs>
        <Grid item sx={{ fontSize: label === 'Total' ? '28px' : '20px', fontWeight: label === 'Total' ? 500 : 400, lineHeight: label === 'Total' ? '28px' : '20px' }} textAlign='right'>
          <ShowBalance api={api} balance={value} decimal={balances?.decimal} decimalPoint={2} token={balances?.token} height={ label === 'Total' ? 23 : 15.35} />
        </Grid>
        <Grid item pt='6px' sx={{ fontSize: label === 'Total' ? '20px' : '16px', fontWeight: label === 'Total' ? 400 : 300, letterSpacing: '-0.015em', lineHeight: '10px' }} textAlign='right'>
          <FormatPrice
            amount={value}
            decimals={balances?.decimal}
            price={price?.amount}
          />
        </Grid>
      </Grid>
      {onClick &&
        <Grid item textAlign='right' sx={{ width: 'fit-content', ml: '8px' }}>
          <IconButton
            onClick={onClick}
            sx={{ p: 0 }}
          >
            <ArrowForwardIosRoundedIcon sx={{ color: 'secondary.light', fontSize: '26px', stroke: theme.palette.secondary.light, strokeWidth: 0 }} />
          </IconButton>
        </Grid>
      }
    </Grid>
  );
}
