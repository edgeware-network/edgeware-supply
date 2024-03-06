#!/usr/bin/env node

import { ApiPromise, WsProvider } from '@polkadot/api';
import { bnToBn, stringToU8a } from '@polkadot/util';
import { u128 } from '@polkadot/types';

module.exports = async (req, res) => {
  const nodeUrl = 'wss://edgeware.jelliedowl.net';

  console.log(`Connecting to API for ${nodeUrl}...`);
  let connected;
  setTimeout(() => {
    if (connected) return;
    res.setHeader('content-type', 'text/plain');
    res.status(500).send('Connection timed out');
    process.exit(1);
  }, 2000);

  // initialize the api
  const api = await ApiPromise.create({
    provider: new WsProvider(nodeUrl),
    throwOnUnknownDecorators: false, // This will suppress the warning
  });
  connected = true;

  const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));
  //
  // get relevant chain data
  //
  try {
    const [issuance, treasury, properties, totalStaked, previousEra] = await Promise.all([
      api.query.balances?.totalIssuance(),
      api.derive.balances?.account(TREASURY_ACCOUNT),
      api.rpc.system.properties(),
      api.query.staking.erasTotalStake(previousEra.toString()),
      api.derive.session.progress(),
    ]);

    const tokenDecimals = properties.tokenDecimals.unwrap();

    const issuanceStr = issuance.div(bnToBn(10).pow(bnToBn(tokenDecimals))).toString(10);
    const treasuryStr = treasury.freeBalance.div(bnToBn(10).pow(bnToBn(tokenDecimals))).toString(10);
    const stakedStr = totalStaked.div(bnToBn(10).pow(bnToBn(tokenDecimals))).toString(10);
    const circulatingStr = issuance.sub(treasury.freeBalance).sub(totalStaked).div(bnToBn(10).pow(bnToBn(tokenDecimals))).toString(10);
    res.setHeader('content-type', 'text/plain');

    if (!!req.query.circulating) {
      res.status(200).send(circulatingStr);
    } else if (!!req.query.treasury) {
      res.status(200).send(treasuryStr);
    } else if (!!req.query.staked) {
      res.status(200).send(stakedStr);
    } else {
      res.status(200).send(issuanceStr);
    }
  } catch (e) {
    res.setHeader('content-type', 'text/plain');
    res.status(500).send('Error fetching Edgeware supply data');
  }
}
