'use strict';

const dns = require('dns').promises;

async function runDomain(ask, addHistory) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                 DOMAIN                     ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    const input = await ask('DOMAIN > ');

    if (!input) {
        console.log('\nДомен не указан.');
        await ask('\nНажми Enter...');
        return;
    }

    const domain = input.trim()
        .replace(/^https?:\/\//i, '')
        .split('/')[0]
        .split(':')[0];

    console.log('\nПроверка: ' + domain);
    console.log('────────────────────────────────────────────');

    try {
        const addresses = await dns.lookup(domain, { all: true });

        console.log('\nIP:');
        for (const item of addresses) {
            console.log(`  ${item.address}`);
        }
    } catch {
        console.log('\nIP: не найден');
    }

    try {
        const mx = await dns.resolveMx(domain);

        console.log('\nMX:');
        for (const item of mx.sort((a, b) => a.priority - b.priority)) {
            console.log(`  ${item.exchange} (priority ${item.priority})`);
        }
    } catch {
        console.log('\nMX: не найден');
    }

    try {
        const ns = await dns.resolveNs(domain);

        console.log('\nNS:');
        for (const item of ns) {
            console.log(`  ${item}`);
        }
    } catch {
        console.log('\nNS: не найден');
    }

    addHistory('DOMAIN', domain);

    console.log('\n────────────────────────────────────────────');
    console.log('Проверка DOMAIN завершена.');

    await ask('\nНажми Enter...');
}

module.exports = {
    runDomain
};
