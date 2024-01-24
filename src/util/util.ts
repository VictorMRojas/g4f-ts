const { Readable } = require('stream');
import { AxiosProxyConfig } from 'axios';

export function createProxyConfig(proxy: string | undefined): AxiosProxyConfig | undefined {
    if (!proxy || proxy.length == 0) return undefined;

    const [host, port] = proxy.split(':');
    if (!host || !port) return undefined;
    return {
        host,
        port: parseInt(port, 10),
    };
}

export function generateRandomId(max: number): string {
    return Math.random().toString(36).substring(0, max);
};

export function stringToStream(str:string) {
    const stream = new Readable({
        read() {
        this.push(str);
        this.push(null);
        }
    });
    return stream;
}