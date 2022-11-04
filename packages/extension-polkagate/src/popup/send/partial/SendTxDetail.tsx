// Copyright 2019-2022 @polkadot/extension-polkadot authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Divider, Grid, Typography } from '@mui/material';
import React from 'react';

import { ShortAddress } from '../../../components';
import { useTranslation } from '../../../hooks';
import { TransferTxInfo } from '../../../util/types';

interface Props {
  txInfo: TransferTxInfo;
}

export default function SendTxDetail({ txInfo }: Props): React.ReactElement {
  const { t } = useTranslation();
  const token = txInfo.api.registry.chainTokens[0];

  return (
    <>
      <Grid
        alignItems='end'
        container
        justifyContent='center'
        sx={{
          m: 'auto',
          pt: '5px',
          width: '90%'
        }}
      >
        <Typography
          fontSize='16px'
          fontWeight={400}
          lineHeight='23px'
        >
          {t<string>('From:')}
        </Typography>
        <Typography
          fontSize='16px'
          fontWeight={400}
          lineHeight='23px'
          maxWidth='45%'
          overflow='hidden'
          pl='5px'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >
          {txInfo.from.name}
        </Typography>
        <Grid
          fontSize='16px'
          fontWeight={400}
          item
          lineHeight='22px'
          pl='5px'
        >
          <ShortAddress
            address={txInfo.from.address}
            addressStyle={{ fontSize: '16px' }}
            inParentheses
          />
        </Grid>
      </Grid>
      {txInfo.throughProxy &&
        <Grid
          alignItems='end'
          container
          justifyContent='center'
          sx={{
            m: 'auto',
            pt: '3px',
            width: '90%'
          }}
        >
          <Typography
            fontSize='16px'
            fontWeight={400}
            lineHeight='23px'
          >
            {t<string>('Through:')}
          </Typography>
          <Typography
            fontSize='16px'
            fontWeight={400}
            lineHeight='23px'
            maxWidth='45%'
            overflow='hidden'
            pl='5px'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
          >
            {txInfo.throughProxy.name}
          </Typography>
          <Grid
            fontSize='16px'
            fontWeight={400}
            item
            lineHeight='22px'
            pl='5px'
          >
            <ShortAddress
              address={txInfo.throughProxy.address}
              addressStyle={{ fontSize: '16px' }}
              inParentheses
            />
          </Grid>
          <Typography
            fontSize='16px'
            fontWeight={400}
            lineHeight='23px'
          >
            {t<string>('as proxy')}
          </Typography>
        </Grid>}
      <Divider sx={{
        bgcolor: 'secondary.main',
        height: '2px',
        m: '5px auto',
        width: '75%'
      }}
      />
      <Grid
        alignItems='end'
        container
        justifyContent='center'
        sx={{
          m: 'auto',
          width: '90%'
        }}
      >
        <Typography
          fontSize='16px'
          fontWeight={400}
          lineHeight='23px'
        >
          {t<string>('To:')}
        </Typography>
        <Typography
          fontSize='16px'
          fontWeight={400}
          lineHeight='23px'
          maxWidth='45%'
          overflow='hidden'
          pl='5px'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >
          {txInfo.to.name}
        </Typography>
        <Grid
          fontSize='16px'
          fontWeight={400}
          item
          lineHeight='22px'
          pl='5px'
        >
          <ShortAddress
            address={txInfo.to.address}
            addressStyle={{ fontSize: '16px' }}
            inParentheses
            showCopy
          />
        </Grid>
      </Grid>
      <Divider sx={{
        bgcolor: 'secondary.main',
        height: '2px',
        m: '5px auto',
        width: '75%'
      }}
      />
      <Grid
        alignItems='end'
        container
        justifyContent='center'
        sx={{
          m: 'auto',
          width: '90%'
        }}
      >
        <Typography
          fontSize='16px'
          fontWeight={400}
          lineHeight='23px'
        >
          {t<string>('Amount:')}
        </Typography>
        <Grid
          fontSize='16px'
          fontWeight={400}
          item
          lineHeight='22px'
          pl='5px'
        >
          {`${txInfo.amount} ${token}`}
        </Grid>
      </Grid>
    </>
  );
}
