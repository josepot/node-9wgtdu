import { start } from 'smoldot';
import chainSpec from './polkadot.json' assert { type: 'json' };

(async () => {
  const client = await start();

  const chain = await client.addChain({
    chainSpec: JSON.stringify(chainSpec),
    potentialRelayChains: [],
  });

  // don't judge, ok? this is just for testing
  const listen = () => {
    chain.nextJsonRpcResponse().then((response) => {
      console.log('got a response:');
      console.log(response);
      listen();
    });
  };
  listen();

  // wait a couple of secs, just in case...
  await new Promise((res) => setTimeout(res, 2_000));

  const rawRequest =
    '{"id":1,"jsonrpc":"2.0","method":"state_getKeys","params":["0x5f3e4907f716ac89b6347d15ececedca88dcde934c658227ee1dfafcd6e16903"]}';

  console.log('sending request', JSON.parse(rawRequest));
  chain.sendJsonRpc(rawRequest);
})();
