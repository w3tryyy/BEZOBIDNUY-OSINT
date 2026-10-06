'use strict';

const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '..', 'data', 'history.json');

async function runHistory(ask) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                 HISTORY                    ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    let history = [];

    try {
        if (fs.existsSync(HISTORY_FILE)) {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch {
        history = [];
    }

    if (!Array.isArray(history) || history.length === 0) {
        console.log('История пуста.');
        await ask('\nНажми Enter...');
        return;
    }

    console.log(`Записей: ${history.length}`);
    console.log('────────────────────────────────────────────');

    history.slice().reverse().forEach((item, index) => {
        const date = item.date
            ? new Date(item.date).toLocaleString()
            : 'неизвестно';

        console.log(`\n#${index + 1}  ${item.type || 'UNKNOWN'}`);
        console.log(`Запрос: ${item.value || '-'}`);
        console.log(`Дата:   ${date}`);
    });

    console.log('\n────────────────────────────────────────────');

    const action = await ask('[C] Очистить / [Enter] Назад > ');

    if (action.toLowerCase() === 'c') {
        fs.writeFileSync(HISTORY_FILE, '[]');
        console.log('\nИстория очищена.');
        await ask('\nНажми Enter...');
    }
}

module.exports = {
    runHistory
};
