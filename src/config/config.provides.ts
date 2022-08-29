import { readFileSync } from 'fs';
import { join } from 'path';

const CONFIG_FILE = 'config.json';

export default () => {
    const config = JSON.parse(readFileSync(join(__dirname, CONFIG_FILE), 'utf8'));
    console.log('',config);
    return config;

};