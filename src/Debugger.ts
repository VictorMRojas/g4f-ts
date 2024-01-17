import dotenv from 'dotenv';
import Debug from 'debug';

dotenv.config();
const debug = Debug('dev');

export class Debugger {
    static log(log: string): void {
        debug(log);
    }
}