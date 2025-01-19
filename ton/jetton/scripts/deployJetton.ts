import { NetworkProvider } from '@ton/blueprint';
import { beginCell, toNano } from '@ton/core';
import { SampleJetton } from '../build/SampleJetton/tact_SampleJetton';

export async function run(provider: NetworkProvider) {
    const jettonMetadata = {
        name: 'KRAVZOVCOIN',
        symbol: 'KRC',
        description: 'KRAVZOVCOIN - жеттон для заработка',
        decimals: 9,
        image: 'https://yury08.github.io/torch-metadata/coin.png',
        thumbnail: {
            '1.0': 'https://yury08.github.io/torch-metadata/coin.png',
        },
        // social: [
        //     {
        //         type: 'twitter',
        //         url: 'https://twitter.com/krosscoin',
        //     },
        //     {
        //         type: 'telegram',
        //         url: 'https://t.me/krosscoin',
        //     },
        //     {
        //         type: 'website',
        //         url: 'https://krosscoin.com',
        //     },
        // ],
        // attributes: [
        //     {
        //         trait_type: 'Type',
        //         value: 'Gaming Token',
        //     },
        //     {
        //         trait_type: 'Platform',
        //         value: 'TON',
        //     },
        // ],
    };

    // Кодируем метаданные в формат Cell
    const content = beginCell()
        .storeUint(0x01, 8) // on-chain формат
        .storeRef(
            beginCell()
                .storeUint(0x00, 8) // off-chain формат
                .storeStringTail(JSON.stringify(jettonMetadata))
                .endCell(),
        )
        .endCell();

    const sampleJetton = provider.open(await SampleJetton.fromInit(provider.sender().address!, content));

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

    console.log('Jetton Master deployed at:', sampleJetton.address);
    console.log('Metadata:', jettonMetadata);
}
