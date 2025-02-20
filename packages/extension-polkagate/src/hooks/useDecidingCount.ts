// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';

import useApi from './useApi';
import useChain from './useChain';
import useTracks from './useTracks';

export type Count = [string, number];

export type DecidingCount = { referenda: Count[]; fellowship: Count[]; };

export default function useDecidingCount(address: string | undefined): DecidingCount | undefined {
  const api = useApi(address);
  const chain = useChain(address);
  const { fellowshipTracks, tracks } = useTracks(address);

  const [counts, setCounts] = useState<DecidingCount | undefined>(undefined);
  const trackIds = useMemo(() => tracks?.map(([id, { name }]) => [id, name]), [tracks]);
  const fellowshipTrackIds = useMemo(() => fellowshipTracks?.map(([id, { name }]) => [id, name]), [fellowshipTracks]);

  useEffect(() => {
    async function fetchDecidingCounts() {
      if ((!trackIds && !fellowshipTrackIds) || !api) {
        return;
      }

      try {
        let allCount = 0;
        const fellowshipDecidingCounts: Count[] = [];
        let decidingCounts;
        let fellowshipCounts;

        if (trackIds) {
          const counts = await Promise.all(trackIds.map(([id]) => api.query.referenda.decidingCount(id)));

          decidingCounts = counts.map((count, index): Count => {
            if (!['whitelisted_caller', 'fellowship_admin'].includes(trackIds[index][1])) {
              allCount += count.toNumber();
            } else {
              fellowshipDecidingCounts.push([String(trackIds[index][1]), count.toNumber() as number]);
            }

            return [String(trackIds[index][1]), count.toNumber() as number];
          });

          decidingCounts.push(['all', allCount]);
        }

        if (fellowshipTrackIds) {
          fellowshipCounts = await Promise.all(fellowshipTracks.map(([id]) => api.query.fellowshipReferenda.decidingCount(id)));

          allCount = 0;
          const Counts = fellowshipCounts.map((c, index): Count => {
            allCount += c.toNumber();

            return [String(fellowshipTrackIds[index][1]), c.toNumber() as number];
          });

          fellowshipDecidingCounts.push(...Counts);
          fellowshipDecidingCounts.push(['all', allCount]);
        }

        setCounts({ fellowship: fellowshipDecidingCounts, referenda: decidingCounts });
      } catch (error) {
        console.error(error);
      }
    }

    if (chain?.genesisHash !== api?.genesisHash?.toString()) {
      setCounts(undefined);
      
      return;
    }

    fetchDecidingCounts();
  }, [api, chain?.genesisHash, fellowshipTrackIds, fellowshipTracks, trackIds]);

  return counts;
}
