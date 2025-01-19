import { NetworkProvider } from '@ton/blueprint';
import { Address, toNano } from '@ton/core';
import { SampleJetton } from '../wrappers/SampleJetton';

export async function run(provider: NetworkProvider) {
    const sampleJetton = provider.open(
        await SampleJetton.fromInit(Address.parse('0QB3IHE4qPlesshoFcYvBlUTjB388ivH4fWCaLGG9hr4GZNX'), null),
    );

    await sampleJetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(sampleJetton.address);

    // run methods on `sampleJetton`
}
