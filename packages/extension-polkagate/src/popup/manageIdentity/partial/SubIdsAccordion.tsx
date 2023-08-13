// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react/jsx-max-props-per-line */

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import React from 'react';

import { useTranslation } from '../../../components/translate';
import DisplaySubId from './DisplaySubId';

interface Props {
  subIdAccounts: { address: string; name: string; }[];
  parentNameID: string;
}

export default function SubIdsAccordion({ parentNameID, subIdAccounts }: Props): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Grid container item sx={{ display: 'block', pt: '15px' }}>
      <Accordion disableGutters sx={{ bgcolor: 'transparent', backgroundImage: 'none', boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'secondary.light', fontSize: '40px' }} />} sx={{ '> .MuiAccordionSummary-content': { m: 0 }, borderBottom: '2px solid', borderBottomColor: '#D5CCD0', m: 0, p: 0 }}>
          <Typography fontSize='22px' fontWeight={700}>
            {t<string>('Sub Identities')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container item rowGap='15px'>
            {subIdAccounts.map((id, index) => (
              <DisplaySubId
                key={index}
                noButtons
                parentName={parentNameID}
                subIdInfo={id}
              />
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
