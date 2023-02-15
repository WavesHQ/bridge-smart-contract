import { GenericContainer, GenericStartedContainer } from '@birthdayresearch/sticky-testcontainers';
import { HardhatNetwork } from '../../src/containers/HardhatNetwork';
export declare class HardhatNetworkContainer extends GenericContainer {
    static readonly IMAGE_NAME = "bridge-packages/hardhatnetwork:0.0.0";
    static readonly RPC_PORT = 8545;
    constructor();
    start(): Promise<StartedHardhatNetworkContainer>;
}
export declare class StartedHardhatNetworkContainer extends GenericStartedContainer {
    readonly RPC_VERSION = "2.0";
    get rpcUrl(): string;
    ready(): Promise<HardhatNetwork>;
    getContainerPort(): number;
    /**
     * For convenience's sake, utility rpc for the current container.
     * JSON 'result' is parsed and returned
     * @throws TestBlockchainRpcError is raised for any errors arising from the RPC
     */
    call(method: string, params: any[]): Promise<any>;
    /**
     * For convenience’s sake, HTTP POST to the RPC URL for the current container.
     * Not error checked, returns the raw JSON as string.
     */
    private post;
}
//# sourceMappingURL=HardhatNetworkContainer.d.ts.map