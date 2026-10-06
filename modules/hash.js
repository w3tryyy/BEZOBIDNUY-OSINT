'use strict';

const crypto = require('crypto');

async function runHash(ask, addHistory) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                  HASH                      ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    const input = await ask('TEXT > ');

    if (!input) {
        console.log('\nТекст не указан.');
        await ask('\nНажми Enter...');
        return;
    }

    console.log('\nРезультаты:');
    console.log('────────────────────────────────────────────');

    for (const algorithm of ['md5', 'sha1', 'sha256', 'sha512']) {
        const hash = crypto
            .createHash(algorithm)
            .update(input, 'utf8')
            .digest('hex');

        console.log(`\n${algorithm.toUpperCase()}:`);
        console.log(hash);
    }

    addHistory('HASH', input);

    console.log('\n────────────────────────────────────────────');
    console.log('Хеширование завершено.');

    await ask('\nНажми Enter...');
}

module.exports = {
    runHash
};
