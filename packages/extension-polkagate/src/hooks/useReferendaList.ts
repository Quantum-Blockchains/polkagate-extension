// Copyright 2019-2023 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletRankedCollectiveTally, PalletReferendaReferendumInfoRankedCollectiveTally } from '@polkadot/types/lookup';

import { useEffect, useMemo, useCallback, useState } from 'react';

import { AccountId } from '@polkadot/types/interfaces/runtime';
import { useParams } from 'react-router';

import { getLatestReferendumsPA, getLatestReferendumsSb, getReferendumPA, getReferendumSb, getReferendumsListSb, getTrackOrFellowshipReferendumsPA } from '../popup/governance/utils/helpers';
import { LatestReferendaPA, LatestReferendaSb, Referendum, ReferendumPolkassembly, ReferendumSubScan } from '../popup/governance/utils/types';
import { useApi, useChainName, useTracks } from '.';
import { LATEST_REFERENDA_LIMIT_TO_LOAD_PER_REQUEST } from '../popup/governance/utils/consts';

export default function useReferendaList(
  pageTrackRef: React.MutableRefObject<{
    listFinished: boolean;
    page: number;
    subMenu: string;
    topMenu: "referenda" | "fellowship";
  }>,
  setFilteredReferenda: React.Dispatch<React.SetStateAction<LatestReferendaPA[] | null | undefined>>,
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  getMore: number | undefined,
  selectedSubMenu: string): LatestReferendaPA | null | undefined {
  const { address, topMenu } = useParams<{ address: string, topMenu: 'referenda' | 'fellowship' }>();
  const { fellowshipTracks, tracks } = useTracks(address);

  const chainName = useChainName(address);

  const [referendaList, setReferendaList] = useState<LatestReferendaPA | null>();
  const [referendumPA, setReferendumPA] = useState<LatestReferendaPA | null>();
  const [referendumSb, setReferendumSb] = useState<LatestReferendaSb | null>();

  const isSubMenuChanged = pageTrackRef.current.subMenu !== selectedSubMenu;
  const isTopMenuChanged = pageTrackRef.current.topMenu !== topMenu;
  const referendaTrackId = tracks?.find((t) => String(t[1].name) === selectedSubMenu.toLowerCase().replace(' ', '_'))?.[0]?.toNumber();

  useEffect(() => {
    if (!referendumPA && !referendumSb) {
      return;
    }

    // setReferendaList({
    //   created_at: string;
    //   description: string;
    //   hash: string;
    //   method: string;
    //   origin: string;
    //   parent_bounty_index: any;
    //   post_id: number;
    //   proposer: string;
    //   status: string;
    //   title: string;
    //   track_number: number;
    //   type: string;
    //   fellowship_origins?: string;
    //   fellowship_origins_id?: number
    // });
  }, []);

  useEffect(() => {
    chainName && selectedSubMenu && fetchRef().catch(console.error);

    async function fetchRef() {
      let list = referendaList;

      // Reset referenda list on menu change
      if (isSubMenuChanged || isTopMenuChanged) {
        setReferendaList(undefined);
        setFilteredReferenda(undefined);
        list = [];
        pageTrackRef.current.subMenu = selectedSubMenu; // Update the ref with new values
        pageTrackRef.current.page = 1;
        pageTrackRef.current.listFinished = false;
      }

      if (pageTrackRef.current.page > 1) {
        setIsLoadingMore(true);
      }

      pageTrackRef.current.topMenu = topMenu;

      if (topMenu === 'referenda' && selectedSubMenu === 'All') {
        const allReferendaSb = await getLatestReferendumsSb(chainName, pageTrackRef.current.page * LATEST_REFERENDA_LIMIT_TO_LOAD_PER_REQUEST);
        const allReferenda = await getLatestReferendumsPA(chainName, pageTrackRef.current.page * LATEST_REFERENDA_LIMIT_TO_LOAD_PER_REQUEST);

        setIsLoadingMore(false);

        if (allReferenda === null) {
          if (pageTrackRef.current.page === 1) { // there is no referendum !!
            setReferendaList(null);

            return;
          }

          pageTrackRef.current.listFinished = true;

          return;
        }

        // filter discussions if any
        const onlyReferenda = allReferenda.filter((r: LatestReferendaPA) => r.type !== 'Discussions');

        setReferendaList(onlyReferenda);

        return;
      }

      let resPA = await getTrackOrFellowshipReferendumsPA(chainName, pageTrackRef.current.page, referendaTrackId);

      setIsLoadingMore(false);

      if (resPA === null) {
        if (pageTrackRef.current.page === 1) { // there is no referendum for this track
          setReferendaList(null);

          return;
        }

        pageTrackRef.current.listFinished = true;

        return;
      }

      if (topMenu === 'fellowship' && !['Whitelisted Caller', 'Fellowship Admin'].includes(selectedSubMenu)) {
        resPA = await addFellowshipOriginsFromSb(resPA) || resPA;
      }

      const concatenated = (list || []).concat(resPA);

      setReferendaList([...concatenated]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainName, fellowshipTracks, getMore, isSubMenuChanged, isTopMenuChanged, referendaTrackId, selectedSubMenu, topMenu, tracks]);

  const addFellowshipOriginsFromSb = useCallback(async (resPA: LatestReferendaPA[]): Promise<LatestReferendaPA[] | undefined> => {
    const resSb = await getReferendumsListSb(chainName, topMenu, pageTrackRef.current.page * LATEST_REFERENDA_LIMIT_TO_LOAD_PER_REQUEST);

    if (resSb) {
      const fellowshipTrackId = fellowshipTracks?.find((t) => String(t[1].name) === selectedSubMenu.toLowerCase())?.[0]?.toNumber();

      pageTrackRef.current.subMenu = selectedSubMenu;

      return resPA.map((r) => {
        const found = resSb.list.find((f) => f.referendum_index === r.post_id);

        if (found) {
          r.fellowship_origins = found.origins;
          r.fellowship_origins_id = found.origins_id;
        }

        return r;
      }).filter((r) => selectedSubMenu === 'All' || r.fellowship_origins_id === fellowshipTrackId);
    }

    return undefined;
  }, [chainName, fellowshipTracks, selectedSubMenu, topMenu]);


  return referendaList;
}
