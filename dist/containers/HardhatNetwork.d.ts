import { BigNumberish, ethers } from 'ethers';
import { EvmContractManager } from '../../src/containers/EvmContractManager';
import type { StartedHardhatNetworkContainer } from '../../src/containers/HardhatNetworkContainer';
/**
 * Class that exposes the methods available to the HardhatNetwork
 */
export declare class HardhatNetwork {
    private readonly startedHardhatContainer;
    readonly contractDeployerAddress: string;
    readonly ethersRpcProvider: ethers.providers.StaticJsonRpcProvider;
    readonly contracts: EvmContractManager;
    readonly contractSigner: ethers.providers.JsonRpcSigner;
    constructor(startedHardhatContainer: StartedHardhatNetworkContainer, contractDeployerAddress: string);
    /**
     * Runs cleanup logic and stops the started container as well. There is no need to stop the main container
     */
    stop(): Promise<void>;
    /**
     * Creates test wallet data and funds it with the maximum amount of Ether
     */
    createTestWallet(): Promise<TestWalletData>;
    fundAddress(address: string, amountToFund: BigNumberish): Promise<void>;
    /**
     * Activates an account so that transactions can be sent to and from this address
     * @param address
     */
    activateAccount(address: string): Promise<void>;
    /**
     * Mines the specified number of blocks
     * @param numBlocks
     */
    generate(numBlocks: BigNumberish): Promise<void>;
    /**
     * Returns an array of addresses representing the accounts that are initialised with the Hardhat node.
     *
     * These address assume that we are not modifying the default initialisation of the Hardhat node.
     * If such a use case exists, we need to re-look this method.
     */
    static get hardhatAccounts(): string[];
    /**
     * Returns TestWalletData tied to a particular pre-defined address that is created when Hardhat initialises.
     * The difference between this and `createTestWallet` is that Hardhat knows the private keys to these
     * addresses, which is necessary for certain transactions
     *
     * @param index zero indexed, meaning that 0 is the first account. There are a total of 20 accounts.
     */
    getHardhatTestWallet(index: number): TestWalletData;
    /**
     * Convenience method to send ether from one address to another
     *
     * @param from the address the ether is being sent from
     * @param to the address the ether is being sent to
     * @param value the amount of ether being sent in wei
     *
     * @return the hash of the transaction
     *
     * @see https://www.investopedia.com/terms/w/wei.asp
     */
    sendEther({ from, to, value }: SendEtherParams): Promise<string>;
}
export interface SendEtherParams {
    from: string;
    to: string;
    value: BigNumberish;
}
export interface TestWalletData {
    testWalletAddress: string;
    testWalletSigner: ethers.providers.JsonRpcSigner;
}
//# sourceMappingURL=HardhatNetwork.d.ts.map