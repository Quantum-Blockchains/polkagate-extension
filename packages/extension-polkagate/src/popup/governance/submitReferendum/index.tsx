// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react/jsx-max-props-per-line */

import { Box, Button, Grid, Modal, Typography, useTheme } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { Check as CheckIcon, Close as CloseIcon, RemoveCircle as AbstainIcon } from '@mui/icons-material';

import { ApiPromise } from '@polkadot/api';

import { PButton, Progress, Select } from '../../../components';
import { useChain, usePreImage, usePreImageHashes, useTranslation } from '../../../hooks';
import methodOptions from './addPreimage/options/methods';
import sectionOptions, { DropdownOption } from './addPreimage/options/sections';
import { PreImage } from './PreImage';

interface Props {
  api: ApiPromise;
  address: string | undefined;
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void
}

export function SubmitReferendum({ address, api, open, setOpen }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const theme = useTheme();
  const chain = useChain(address);
  const preImageHashes = usePreImageHashes(address);
  const preImage = usePreImage(address, preImageHashes?.[3]);
  const [section, setSection] = useState<string>();
  const [method, setMethod] = useState<string>();

  console.log('preImagepreImage==', preImage?.proposal?.toJSON());

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    left: '50%',
    position: 'absolute' as 'absolute',
    pb: 3,
    pt: 2,
    px: 4,
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={{ ...style }}>
        <Grid alignItems='center' container justifyContent='space-between' pt='5px'>
          <Grid item>
            <Typography fontSize='22px' fontWeight={700}>
              {t('Preimage')}
            </Typography>
          </Grid>
          <Grid item>
            <CloseIcon onClick={handleClose} sx={{ color: 'primary.main', cursor: 'pointer', stroke: theme.palette.primary.main, strokeWidth: 1.5 }} />
          </Grid>
        </Grid>
        <Typography fontSize='16px' fontWeight={400} sx={{ py: '20px' }}>
          {t('Prior to submitting a referendum, it is necessary to choose/submit a preimage. The preimage hash will then be utilized during the submission process of the referendum.')}
        </Typography>
        <Grid container sx={{ pt: '15px' }}>
          <Grid container item>
            <PButton
              _mt='15px'
              _width={30}
              text={t<string>('Submit a new preimage')}
              _ml={0}
            // _onClick={handleClose}
            />
          </Grid>
          <Grid container item sx={{ py: '10px' }}>
            <Typography fontSize='16px' fontWeight={500}>
              {t('Or')}
            </Typography>
          </Grid>
          <Grid container item sx={{ pb: '5px' }}>
            <Typography fontSize='16px' fontWeight={500}>
              {t('Choose from existing preimages')}
            </Typography>
          </Grid>
          <Grid container  sx={{ height: '300px', overflowY: 'scroll', border: 1, borderColor: 'secondary.light', borderRadius: '5px', p: '10px' }}>
            {preImageHashes
              ? preImageHashes.map((hash, index) => (
                <PreImage
                  address={address}
                  hash={hash}
                  key={index}
                />
              ))
              : <Progress pt='95px' size={125} title={t('Loading preimages...')} />
            }
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
