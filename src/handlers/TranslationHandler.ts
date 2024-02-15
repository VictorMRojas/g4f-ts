import { ITranslationOptions } from "../interfaces/ITranslationOptions";
import { Signale } from 'signale';
import { providers} from '../Providers/ProviderList';
import { getProviderFromList, runLog } from "../util/util";

const provider_log = new Signale({ interactive: true, scope: 'provider' });

class TranslationHandler { 
    providersList: typeof providers;

    constructor() {
        this.providersList = Object.fromEntries(
            Object.entries(providers)
                .filter(([_, provider]: [string, any]) => provider.type === "Translation")
            );
    }

    /**
     * Translates text to a target language.
     * @param {Options} options - Options for translation.
     * @returns {Promise<any>} - Promise that resolves with a object with the translated data.
     */
    async generateTranslation(options: ITranslationOptions): Promise<any> {
        let { debug, provider } = options;
        if (!provider) provider = getProviderFromList(this.providersList, provider_log, { model: undefined, debug }); 
        else if (debug) runLog(provider_log.success, `Provider found: ${provider.name}`, true)

        if (!provider.supported_langs.includes(options.source)) throw new Error("The source language ID is not included in the provider's list of supported IDs.");
        if (!provider.supported_langs.includes(options.target)) throw new Error("The target language ID is not included in the provider's list of supported IDs.");

        if (debug) runLog(provider_log.await, `Fetching data from the provider: ${provider.name}`);
        const data = await provider.fetchData(options);
        if (debug) runLog(provider_log.success, `Data was successfully fetched from the "${provider.name}" provider`, true);            
        
        return data;
    }
}

export { TranslationHandler as default }