import { expect } from "chai";
import { Provider, Account, Contract } from "starknet";
import { getAccounts } from "./helpers/accounts";
import { reset, load, dump, cleanup } from "./helpers/devnet";

import * as fs from "fs";
import { after } from "mocha";


describe('counter', function () {
    let provider: Provider;
    let alice: Account;
    let bob: Account;
    let charlie: Account;

    let counterSierra: any;
    let counterCasm: any;

    let counter: Contract;

    this.timeout(120000);

    before(async () => {
        await reset();

        provider = new Provider({ sequencer: { baseUrl:"http://127.0.0.1:5050"} });
        [alice, bob, charlie] = getAccounts(provider);
        counterSierra = JSON.parse(fs.readFileSync( "contracts/counter.sierra.json").toString( "ascii"));
        counterCasm = JSON.parse(fs.readFileSync( "contracts/counter.casm.json").toString( "ascii"));
        const deployResponse = await alice.declareAndDeploy(
            { contract: counterSierra, casm: counterCasm },
            { maxFee: 1000000000000 } //workarounf
        );

        counter = new Contract(
            counterSierra.abi,
            deployResponse.deploy.contract_address,
            provider
        );

        counter.connect(alice);

        await dump()
    });

    beforeEach(async () => {
        await load()
    });

    after(async () => {
        cleanup();
    });

    it('increments', async function () {
        const pre = await counter.get_counter();
        await counter.increment()
        const post = await counter.get_counter();
        expect(post).to.equal(pre + 1n);
    });

    it('increments x2', async function () {
        const pre = await counter.get_counter();
        await counter.increment();
        await counter.increment();
        const post = await counter.get_counter();
        expect(post).to.equal(pre + 2n);
    });
});
