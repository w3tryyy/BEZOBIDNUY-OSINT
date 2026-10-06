'use strict';

const os = require('os');

async function runSystem(ask) {
    console.clear();

    console.log('╔════════════════════════════════════════════╗');
    console.log('║                 SYSTEM                     ║');
    console.log('║             BEZOBIDNUY OSINT               ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');

    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    const formatBytes = bytes => {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let value = bytes;
        let i = 0;

        while (value >= 1024 && i < units.length - 1) {
            value /= 1024;
            i++;
        }

        return `${value.toFixed(2)} ${units[i]}`;
    };

    const formatUptime = seconds => {
        const days = Math.floor(seconds / 86400);
        seconds %= 86400;

        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;

        const minutes = Math.floor(seconds / 60);

        return `${days}d ${hours}h ${minutes}m`;
    };

    console.log('OS            : ' + os.type());
    console.log('Platform      : ' + process.platform);
    console.log('Architecture  : ' + process.arch);
    console.log('Node.js       : ' + process.version);
    console.log('Hostname      : ' + os.hostname());
    console.log('CPU cores     : ' + (os.cpus().length || 'не определено'));
    console.log('CPU           : ' + (os.cpus()[0]?.model || 'не определено'));
    console.log('Memory total  : ' + formatBytes(total));
    console.log('Memory used   : ' + formatBytes(used));
    console.log('Memory free   : ' + formatBytes(free));
    console.log('Uptime        : ' + formatUptime(os.uptime()));

    console.log('\n────────────────────────────────────────────');
    console.log('Системная информация получена.');

    await ask('\nНажми Enter...');
}

module.exports = {
    runSystem
};
