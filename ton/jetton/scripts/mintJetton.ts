import { NetworkProvider } from '@ton/blueprint';
import { Address, toNano } from '@ton/core';
import { SampleJetton } from '../build/SampleJetton/tact_SampleJetton';
import { buildOnchainMetadata } from '../utils/jetton-helper-util';

export async function run(provider: NetworkProvider) {
    const jettonParams = {
        name: 'KRAVZOVCOIN',
        description: 'KRAVZOVCOIN - official token for earning',
        symbol: 'KRN',
        image: 'https://yury08.github.io/torch-metadata/coin.png',
    };

    // content cell
    let content = buildOnchainMetadata(jettonParams);

    const sampleJetton = provider.open(await SampleJetton.fromInit(provider.sender().address as Address, content));

    await sampleJetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Mint',
            amount: 100000000000000n,
            receiver: provider.sender().address as Address,
        },
    );

    await provider.waitForDeploy(sampleJetton.address);
}
