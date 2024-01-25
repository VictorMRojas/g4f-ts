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

export function stringToStream(text:string, chunkSize:number) {
    let offset = 0;
  
    return new Readable({
        read(size:any) {
            const chunk = text.slice(offset, offset + chunkSize);
            offset += chunkSize;
            if (chunk.length > 0) {
                this.push(chunk);
            } else {
                this.push(size ? null : null);
            }
        }
    });
}