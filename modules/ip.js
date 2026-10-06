'use strict';

const dns = require('dns').promises;

async function runIP(ask, addHistory) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                   IP                       ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    const input = await ask('IP / DOMAIN > ');

    if (!input) {
        console.log('\nАдрес не указан.');
        await ask('\nНажми Enter...');
        return;
    }

    const target = input.trim();

    console.log('\nПроверка: ' + target);
    console.log('────────────────────────────────────────────');

    try {
        const result = await dns.lookup(target, {
            all: true
        });

        console.log('\nРезультаты:');

        for (const item of result) {
            console.log(`  ${item.address}  (${item.family === 4 ? 'IPv4' : 'IPv6'})`);
        }

        addHistory('IP', target);
    } catch (error) {
        console.log('\nНе удалось определить IP.');
    }

    console.log('\n────────────────────────────────────────────');
    console.log('IP-проверка завершена.');

    await ask('\nНажми Enter...');
}

module.exports = {
    runIP
};
