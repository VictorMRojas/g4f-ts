import { providers } from "./ProviderHandler";
import { IOptions } from "./interfaces/IOptions";

class OptionsHandler {
    /**
     * Checks the validity of options for chat generation.
     * @param {Object} options - Options for chat generation.
     * @throws {Error} - Throws an error if options are invalid.
     * @returns {boolean} - Returns true if options are valid.
     */
    static check(options?: IOptions) {
        if (!options || typeof options !== 'object') throw new Error("Options must be a valid object.");
        if (options.provider && !(options.provider instanceof providers[Object.keys(providers)[0]].constructor)) throw new Error("Provider option must be valid. Try { provider: (new G4F()).providers.ChatBase, ... }");
        if (options.retry) {
            if (!options.retry.times) throw new Error("Times option must be provided.");
            if (isNaN(options.retry.times)) throw new Error("Times option must be an integer.");
            if (options.retry.condition) {
                if (typeof options.retry.condition !== 'function') throw new Error("Retry condition option must be a function.");
                if (typeof options.retry.condition("") !== 'boolean') throw new Error("Retry condition option must be a function returning a boolean");                
            }        
            if (!options.retry.condition && options.retry.times) throw new Error("Retry condition must be provided if times option is specified.");
        }
        if (options.output && typeof options.output !== 'function') throw new Error("Output option must be a function");        
        return true;
    }
}

export default OptionsHandler;