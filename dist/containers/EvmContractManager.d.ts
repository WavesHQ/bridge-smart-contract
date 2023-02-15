import { ethers, Signer } from 'ethers';
import type { StartedHardhatNetworkContainer } from '../../src/containers/HardhatNetworkContainer';
/**
 * Class which encapsulates EVM contract logic. Tightly coupled to a HardhatNetworkContainer.
 *
 * @param container A started HardhatNetworkContainer
 * @param signer An ethers signer attached to deployed contracts by default
 * @param provider An ethers provider used to query the connected chain
 */
export declare class EvmContractManager {
    #private;
    private readonly startedHardhatContainer;
    private readonly signer;
    private readonly provider;
    constructor(startedHardhatContainer: StartedHardhatNetworkContainer, signer: ethers.Signer, provider: ethers.providers.Provider);
    /**
     * There is no need to wait for the contracts to be deployed since that is handled by the hardhat
     * task that deploys the contract
     *
     * @param deploymentName
     * @param contractName
     * @param abi
     * @param deployArgs
     * @param linkedLibraries
     */
    deployContract<Abi extends ethers.BaseContract>({ deploymentName, contractName, abi, deployArgs, linkedLibraries, }: DeployContractParams): Promise<Abi>;
    getDeployedContracts(): Map<string, DeployedContract<any>>;
    getDeployedContract<Abi extends ethers.BaseContract>(deployedName: string, userSigner?: Signer): Abi;
    isContractDeployedOnChain(deployedName: string): Promise<boolean>;
    isContractNameInUse(contractName: string): boolean;
    private registerDeployedContract;
}
export interface DeployContractParams {
    deploymentName: string;
    contractName: string;
    abi: readonly Object[];
    deployArgs?: any[];
    linkedLibraries?: Record<string, string>;
}
export interface DeployedContract<Abi extends ethers.BaseContract> {
    name: DeployContractParams['deploymentName'];
    ref: Abi;
}
//# sourceMappingURL=EvmContractManager.d.ts.map