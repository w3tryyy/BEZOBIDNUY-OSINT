'use strict';

const dns = require('dns').promises;

async function runDNS(ask, addHistory) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                  DNS                       ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    const domain = await ask('DOMAIN > ');

    if (!domain) {
        console.log('\nДомен не указан.');
        await ask('\nНажми Enter...');
        return;
    }

    const cleanDomain = domain
        .trim()
        .replace(/^https?:\/\//i, '')
        .split('/')[0];

    console.log('\nПроверка: ' + cleanDomain);
    console.log('────────────────────────────────────────────');

    const records = {};

    const types = [
        ['A', 'resolve4'],
        ['AAAA', 'resolve6'],
        ['MX', 'resolveMx'],
        ['NS', 'resolveNs'],
        ['TXT', 'resolveTxt'],
        ['CNAME', 'resolveCname']
    ];

    for (const [type, method] of types) {
        try {
            const result = await dns[method](cleanDomain);
            records[type] = result;

            console.log('\n[' + type + ']');

            if (Array.isArray(result)) {
                for (const item of result) {
                    if (typeof item === 'object') {
                        console.log(JSON.stringify(item));
                    } else {
                        console.log(item);
                    }
                }
            } else {
                console.log(result);
            }
        } catch {
            records[type] = [];
            console.log('\n[' + type + '] Нет доступных записей');
        }
    }

    addHistory('DNS', cleanDomain);

    console.log('\n────────────────────────────────────────────');
    console.log('DNS-проверка завершена.');

    await ask('\nНажми Enter...');
}

module.exports = {
    runDNS
};
