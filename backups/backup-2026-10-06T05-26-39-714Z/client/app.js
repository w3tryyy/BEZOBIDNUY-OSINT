'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const dnsModule = require('../modules/dns');
const ipModule = require('../modules/ip');
const domainModule = require('../modules/domain');
const urlModule = require('../modules/url');
const hashModule = require('../modules/hash');
const systemModule = require('../modules/system');
const historyModule = require('../modules/history');
const settingsModule = require('../modules/settings');
const updaterModule = require('../modules/updater');

const CONFIG_FILE = path.join(__dirname, '..', 'config', 'config.json');
const HISTORY_FILE = path.join(__dirname, '..', 'data', 'history.json');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let COLORS = {
    primary: '\x1b[35m',
    secondary: '\x1b[36m',
    text: '\x1b[37m',
    reset: '\x1b[0m'
};

function loadJson(file, fallback) {
    try {
        if (!fs.existsSync(file)) return fallback;
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
        return fallback;
    }
}

function saveJson(file, data) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function applyTheme() {
    const config = loadJson(CONFIG_FILE, { theme: 'purple' });

    const themes = {
        purple: {
            primary: '\x1b[35m',
            secondary: '\x1b[36m',
            text: '\x1b[37m'
        },
        cyan: {
            primary: '\x1b[36m',
            secondary: '\x1b[96m',
            text: '\x1b[37m'
        },
        green: {
            primary: '\x1b[32m',
            secondary: '\x1b[92m',
            text: '\x1b[37m'
        },
        red: {
            primary: '\x1b[31m',
            secondary: '\x1b[91m',
            text: '\x1b[37m'
        },
        white: {
            primary: '\x1b[37m',
            secondary: '\x1b[97m',
            text: '\x1b[37m'
        }
    };

    COLORS = {
        ...(themes[config.theme] || themes.purple),
        reset: '\x1b[0m'
    };
}

function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer.trim());
        });
    });
}

function addHistory(type, value) {
    const history = loadJson(HISTORY_FILE, []);
    const config = loadJson(CONFIG_FILE, { history: true });

    if (config.history === false) return;

    history.push({
        type,
        value,
        date: new Date().toISOString()
    });

    saveJson(HISTORY_FILE, history);
}

function banner() {
    applyTheme();
    console.clear();

    console.log(COLORS.primary + '╔══════════════════════════════════════════════╗' + COLORS.reset);
    console.log(COLORS.primary + '║              BEZOBIDNUY OSINT               ║' + COLORS.reset);
    console.log(COLORS.primary + '║                  v1.0.0                     ║' + COLORS.reset);
    console.log(COLORS.primary + '╚══════════════════════════════════════════════╝' + COLORS.reset);
    console.log('');
}

function menu() {
    console.log(COLORS.secondary + '┌──────────────────────────────────────────────┐' + COLORS.reset);
    console.log(COLORS.secondary + '│                 ОСНОВНОЕ МЕНЮ                │' + COLORS.reset);
    console.log(COLORS.secondary + '├──────────────────────────────────────────────┤' + COLORS.reset);

    console.log(COLORS.primary + '│ 1. DNS                                       │' + COLORS.reset);
    console.log(COLORS.primary + '│ 2. IP                                        │' + COLORS.reset);
    console.log(COLORS.primary + '│ 3. DOMAIN                                    │' + COLORS.reset);
    console.log(COLORS.primary + '│ 4. URL                                       │' + COLORS.reset);
    console.log(COLORS.primary + '│ 5. HASH                                      │' + COLORS.reset);
    console.log(COLORS.primary + '│ 6. SYSTEM                                    │' + COLORS.reset);
    console.log(COLORS.primary + '│ 7. HISTORY                                   │' + COLORS.reset);
    console.log(COLORS.primary + '│ 8. SETTINGS                                  │' + COLORS.reset);
    console.log(COLORS.primary + '│ 9. UPDATE SYSTEM                             │' + COLORS.reset);
    console.log(COLORS.primary + '│ 0. EXIT                                      │' + COLORS.reset);

    console.log(COLORS.secondary + '└──────────────────────────────────────────────┘' + COLORS.reset);
    console.log('');
}

async function placeholder(name) {
    console.clear();

    console.log(COLORS.primary + '╔══════════════════════════════════════════════╗' + COLORS.reset);
    console.log(COLORS.primary + '║ ' + name.padEnd(44) + '║' + COLORS.reset);
    console.log(COLORS.primary + '╚══════════════════════════════════════════════╝' + COLORS.reset);
    console.log('');
    console.log('Модуль будет добавлен позже.');

    await ask('\nНажми Enter...');
}

async function main() {
    while (true) {
        banner();
        menu();

        const choice = await ask(
            COLORS.secondary + 'BEZOBIDNUY > ' + COLORS.reset
        );

        switch (choice) {
            case '1':
                await dnsModule.runDNS(ask, addHistory);
                break;

            case '2':
                await ipModule.runIP(ask, addHistory);
                break;

            case '3':
                await domainModule.runDomain(ask, addHistory);
                break;

            case '4':
                await urlModule.runURL(ask, addHistory);
                break;

            case '5':
                await hashModule.runHash(ask, addHistory);
                break;

            case '6':
                await systemModule.runSystem(ask);
                break;

            case '7':
                await historyModule.runHistory(ask);
                break;

            case '8':
                await settingsModule.runSettings(ask);
                break;

            case '9':
                await updaterModule.runUpdater(ask);
                break;

            case '0':
                console.clear();
                console.log('Выход...');
                rl.close();
                return;

            default:
                console.log('\nНеизвестная команда.');
                await ask('Нажми Enter...');
        }
    }
}

main().catch(error => {
    console.error('\nОшибка:', error);
    rl.close();
});
