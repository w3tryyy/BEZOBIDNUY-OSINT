'use strict';

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'config.json');

function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return { theme: 'purple' };
        }

        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch {
        return { theme: 'purple' };
    }
}

function saveConfig(config) {
    fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function runSettings(ask) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                 SETTINGS                   ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    const config = loadConfig();

    console.log('Текущая тема: ' + config.theme);
    console.log('');
    console.log('1. Purple');
    console.log('2. Cyan');
    console.log('3. Green');
    console.log('4. Red');
    console.log('5. White');
    console.log('0. Назад');
    console.log('');

    const choice = await ask('THEME > ');

    const themes = {
        '1': 'purple',
        '2': 'cyan',
        '3': 'green',
        '4': 'red',
        '5': 'white'
    };

    if (choice === '0') return;

    if (themes[choice]) {
        config.theme = themes[choice];
        saveConfig(config);

        console.log('\nТема сохранена: ' + config.theme);
    } else {
        console.log('\nНеизвестная тема.');
    }

    await ask('\nНажми Enter...');
}

module.exports = {
    runSettings
};
