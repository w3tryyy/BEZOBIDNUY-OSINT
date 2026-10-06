'use strict';

async function runURL(ask, addHistory) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                   URL                      ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    let input = await ask('URL > ');

    if (!input) {
        console.log('\nURL не указан.');
        await ask('\nНажми Enter...');
        return;
    }

    input = input.trim();

    if (!/^https?:\/\//i.test(input)) {
        input = 'https://' + input;
    }

    let url;

    try {
        url = new URL(input);
    } catch {
        console.log('\nНекорректный URL.');
        await ask('\nНажми Enter...');
        return;
    }

    console.log('\nПроверка: ' + url.href);
    console.log('────────────────────────────────────────────');

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(10000)
        });

        console.log('\nСтатус: ' + response.status + ' ' + response.statusText);
        console.log('Финальный URL: ' + response.url);
        console.log('Content-Type: ' + (response.headers.get('content-type') || 'не указан'));
        console.log('Server: ' + (response.headers.get('server') || 'не указан'));
        console.log('Content-Length: ' + (response.headers.get('content-length') || 'не указан'));

        addHistory('URL', input);
    } catch (error) {
        console.log('\nНе удалось подключиться.');
        console.log('Причина: ' + error.message);
    }

    console.log('\n────────────────────────────────────────────');
    console.log('URL-проверка завершена.');

    await ask('\nНажми Enter...');
}

module.exports = {
    runURL
};
