'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const UPDATE_DIR = path.join(ROOT, 'update');
const FILES_DIR = path.join(UPDATE_DIR, 'files');
const MANIFEST = path.join(UPDATE_DIR, 'update.json');
const BACKUPS_DIR = path.join(ROOT, 'backups');

const CURRENT_VERSION = '1.0.0';

function loadManifest() {
    try {
        if (!fs.existsSync(MANIFEST)) return null;
        return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    } catch {
        return null;
    }
}

function copyRecursive(src, dest) {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });

        for (const item of fs.readdirSync(src)) {
            copyRecursive(
                path.join(src, item),
                path.join(dest, item)
            );
        }

        return;
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
}

async function runUpdater(ask) {
    console.clear();

    console.log('╔══════════════════════════════════════════════╗');
    console.log('║                UPDATE SYSTEM                ║');
    console.log('║              BEZOBIDNUY OSINT               ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');

    console.log('Текущая версия: ' + CURRENT_VERSION);
    console.log('');

    const manifest = loadManifest();

    if (!manifest) {
        console.log('Обновлений не найдено.');
        console.log('Файл update/update.json отсутствует.');
        await ask('\nНажми Enter...');
        return;
    }

    console.log('Доступная версия: ' + (manifest.version || 'неизвестно'));
    console.log('');

    if (!manifest.version || manifest.version === CURRENT_VERSION) {
        console.log('Установлена последняя версия.');
        await ask('\nНажми Enter...');
        return;
    }

    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
        console.log('Ошибка: список файлов обновления пуст.');
        await ask('\nНажми Enter...');
        return;
    }

    console.log('Файлов для обновления: ' + manifest.files.length);
    console.log('');

    const backupName =
        'backup-' +
        new Date().toISOString()
            .replace(/[:.]/g, '-');

    const backupDir = path.join(BACKUPS_DIR, backupName);

    try {
        fs.mkdirSync(backupDir, { recursive: true });

        console.log('Создание backup...');

        for (const file of manifest.files) {
            const target = path.join(ROOT, file);
            const backup = path.join(backupDir, file);

            if (fs.existsSync(target)) {
                copyRecursive(target, backup);
            }
        }

        console.log('Backup создан: ' + backupName);
        console.log('');

        console.log('Установка обновления...');

        for (const file of manifest.files) {
            const source = path.join(FILES_DIR, file);
            const target = path.join(ROOT, file);

            if (!fs.existsSync(source)) {
                throw new Error('Файл отсутствует: ' + file);
            }

            copyRecursive(source, target);
            console.log('✓ ' + file);
        }

        console.log('');
        console.log('Обновление установлено.');
        console.log('Новая версия: ' + manifest.version);
    } catch (error) {
        console.log('');
        console.log('ОШИБКА ОБНОВЛЕНИЯ:');
        console.log(error.message);
        console.log('');
        console.log('Backup сохранён: ' + backupName);
    }

    await ask('\nНажми Enter...');
}

module.exports = {
    runUpdater
};
