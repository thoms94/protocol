import { initTestEnvironment } from '~/utils/environment/initTestEnvironment';
import { deploySystem } from '~/utils/deploySystem';
import { beginSetup } from '~/contracts/factory/transactions/beginSetup';
import { getAmguToken } from '~/contracts/engine/calls/getAmguToken';
import { createQuantity, isEqual } from '@melonproject/token-math/quantity';
import { getPrices } from '~/contracts/prices/calls/getPrices';
import { update } from '~/contracts/prices/transactions/update';
import { getAmguPrice } from '~/contracts/engine/calls/getAmguPrice';
import { setAmguPrice } from '~/contracts/engine/transactions/setAmguPrice';
import {
  subtract,
  greaterThan,
  BigInteger,
} from '@melonproject/token-math/bigInteger';
import {
  getPrice,
  isEqual as isEqualPrice,
} from '@melonproject/token-math/price';
import { sign } from '~/utils/environment/sign';

const shared: any = {};

beforeAll(async () => {
  shared.env = await deploySystem(await initTestEnvironment());
  shared.accounts = await shared.env.eth.getAccounts();
});

const randomString = (length = 4) =>
  Math.random()
    .toString(36)
    .substr(2, length);

test('Set amgu and check its usage', async () => {
  const fundName = `test-fund-${randomString()}`;
  const {
    exchangeConfigs,
    priceSource,
    tokens,
    engine,
    version,
  } = shared.env.deployment;
  const [quoteToken, baseToken] = tokens;

  const defaultTokens = [quoteToken, baseToken];
  const fees = [];
  const amguToken = await getAmguToken(shared.env, version);
  const amguPrice = createQuantity(amguToken, '1000000000');
  const oldAmguPrice = await getAmguPrice(shared.env, engine);
  const newAmguPrice = await setAmguPrice(shared.env, engine, amguPrice);

  expect(isEqual(newAmguPrice, amguPrice)).toBe(true);
  expect(isEqual(newAmguPrice, oldAmguPrice)).toBe(false);

  const args = {
    defaultTokens,
    exchangeConfigs,
    fees,
    fundName,
    nativeToken: quoteToken,
    priceSource,
    quoteToken,
  };

  const newPrice = getPrice(
    createQuantity(baseToken, '1'),
    createQuantity(quoteToken, '2'),
  );

  await update(shared.env, priceSource, [newPrice]);

  const [price] = await getPrices(shared.env, priceSource, [baseToken]);
  expect(isEqualPrice(price, newPrice)).toBe(true);

  const prepared = await beginSetup.prepare(shared.env, version, args);

  const preBalance = await shared.env.eth.getBalance(shared.accounts[0]);

  const signedTransactionData = await sign(shared.env, prepared.rawTransaction);

  const result = await beginSetup.send(
    shared.env,
    version,
    signedTransactionData,
    args,
    undefined,
  );

  const postBalance = await shared.env.eth.getBalance(shared.accounts[0]);

  const diffQ = subtract(preBalance, postBalance);

  expect(result).toBeTruthy();
  expect(greaterThan(diffQ, new BigInteger(prepared.rawTransaction.gas))).toBe(
    true,
  );
});
