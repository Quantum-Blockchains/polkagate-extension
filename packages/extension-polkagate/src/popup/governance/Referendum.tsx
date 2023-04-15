// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react/jsx-max-props-per-line */

import { ScheduleRounded as ClockIcon } from '@mui/icons-material/';
import { Divider, Grid, useTheme } from '@mui/material';
import React from 'react';

import { Identity } from '../../components';
import { useApi, useChain, useTranslation } from '../../hooks';
import { LatestReferenda } from './helpers';

interface Props {
  address: string;
  key: number;
  referendum: LatestReferenda;
}

const STATUS_COLOR = {
  Canceled: '#ff4f4f',
  ConfirmStarted: '#27ae60',
  Confirmed: '#2ecc71',
  Deciding: '#3498db',
  Executed: '#8e44ad',
  Rejected: '#f39c12',
  Submitted: '#bdc3c7',
  TimedOut: '#7f8c8d',
};

export function Referendum({ address, key, referendum }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const api = useApi(address);
  const chain = useChain(address);
  const theme = useTheme();

  return (
    <Grid item key={key} sx={{ bgcolor: 'background.paper', borderRadius: '10px', cursor: 'pointer', height: '109px', p: '20px', my: '13px', '&:hover': { boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' } }}>
      <Grid item sx={{ fontSize: 20, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {`#${referendum.post_id}  ${referendum.title || t('No title yet')}`}
      </Grid>
      <Grid alignItems='center' container item justifyContent='space-between'>
        <Grid alignItems='center' container item xs={9.5}>
          <Grid item sx={{ fontSize: '16px', fontWeight: 400, mr: '17px' }}>
            {t('By')}:
          </Grid>
          <Grid item sx={{ mb: '10px' }}>
            <Identity
              api={api}
              chain={chain}
              formatted={referendum.proposer}
              identiconSize={25}
              showSocial={false}
              style={{
                fontSize: '16px',
                fontWeight: 400,
                height: '38px',
                lineHeight: '47px',
                maxWidth: '100%',
                minWidth: '35%',
                width: 'fit-content',
              }}
            />
          </Grid>
          <Divider flexItem orientation='vertical' sx={{ mx: '2%' }} />
          {referendum.origin &&
            <>
              <Grid item sx={{ bgcolor: 'background.default', border: `1px solid ${theme.palette.primary.main}`, borderRadius: '30px', fontSize: '16px', fontWeight: 400, p: '0.5px 14.5px' }}>
                {referendum.origin.replace(/([A-Z])/g, ' $1').trim()}
              </Grid>
              <Divider flexItem orientation='vertical' sx={{ mx: '2%' }} />
            </>
          }
          <Grid item sx={{ fontSize: '16px', fontWeight: 400, opacity: 0.6 }}>
            {referendum.method}
          </Grid>
          <Divider flexItem orientation='vertical' sx={{ mx: '2%' }} />
          <ClockIcon sx={{ fontSize: 27, ml: '10px' }} />
          <Grid item sx={{ fontSize: '16px', fontWeight: 400, pl: '1%' }}>
            {new Date(referendum.created_at).toDateString()}
          </Grid>
        </Grid>
        <Grid item sx={{ textAlign: 'center', mb: '10px', color: 'white', fontSize: '16px', fontWeight: 400, border: '1px solid primary.main', borderRadius: '30px', bgcolor: STATUS_COLOR[referendum.status], p: '10px 15px' }} xs={1.5}>
          {referendum.status.replace(/([A-Z])/g, ' $1').trim()}
        </Grid>
      </Grid>
    </Grid>
  );
}
