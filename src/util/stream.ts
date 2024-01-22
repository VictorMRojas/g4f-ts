import { AxiosResponse } from 'axios';

export function handleStream(data:any, options:any, responseFunc:any) {
    if (!options || !options.stream) return responseFunc(data)
    return "Stream option not supported yet."
}