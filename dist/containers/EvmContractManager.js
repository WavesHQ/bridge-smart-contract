"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmContractManager = void 0;
const ethers_1 = require("ethers");
/**
 * Class which encapsulates EVM contract logic. Tightly coupled to a HardhatNetworkContainer.
 *
 * @param container A started HardhatNetworkContainer
 * @param signer An ethers signer attached to deployed contracts by default
 * @param provider An ethers provider used to query the connected chain
 */
class EvmContractManager {
    startedHardhatContainer;
    signer;
    provider;
    #deployedContracts = new Map();
    constructor(startedHardhatContainer, signer, provider) {
        this.startedHardhatContainer = startedHardhatContainer;
        this.signer = signer;
        this.provider = provider;
    }
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
    async deployContract({ deploymentName, contractName, abi, deployArgs = [], linkedLibraries = undefined, }) {
        // Throws an error if name already exists as contract names should be unique
        if (this.isContractNameInUse(deploymentName)) {
            const existingContract = this.getDeployedContract(deploymentName);
            throw Error(`Contract '${deploymentName}' has already been deployed at ${existingContract.address}. Please use another name for the contract.`);
        }
        // Comma-separate any contract deployment arguments which were passed in
        // If there were no deployment arguments, do not pass in the deployargs flag
        const deployArgsFlags = deployArgs.length > 0 ? ['--deployargs', deployArgs.join(',')] : [];
        const linkedLibrariesFlags = linkedLibraries !== undefined ? ['--libraries', JSON.stringify(linkedLibraries)] : [];
        // The output of the deployContract task is the deployed contract's address
        const { output, exitCode } = await this.startedHardhatContainer.exec([
            'npx',
            'hardhat',
            // specify path to config file
            '--config',
            './src/hardhat.config.ts',
            // specify localhost network so that the contract is deployed to the already
            // running hardhat network instance
            '--network',
            'localhost',
            'deployContract',
            '--name',
            contractName,
            // Pass in any contract deployment arguments if any
            ...deployArgsFlags,
            // Pass in any necessary library links if any
            ...linkedLibrariesFlags,
        ]);
        const isBadExitCode = exitCode !== 0;
        if (isBadExitCode) {
            throw Error(`Hardhat contract deployment task exited with code ${exitCode}`);
        }
        // Outputs should only be valid EVM addresses. Anything else is considered an error, and
        // means that something went wrong with executing the hardhat contract deployment task
        if (!ethers_1.ethers.utils.isAddress(output.trim())) {
            throw Error(output);
        }
        // Enrich the contract with relevant metadata
        const deployedContract = {
            name: deploymentName,
            ref: new ethers_1.ethers.Contract(output.trim(), abi, this.signer),
        };
        // Register the contract for future access
        await this.registerDeployedContract(deployedContract);
        return deployedContract.ref;
    }
    getDeployedContracts() {
        return this.#deployedContracts;
    }
    getDeployedContract(deployedName, userSigner) {
        const contract = this.#deployedContracts.get(deployedName);
        if (contract === undefined) {
            throw new Error(`Contract '${deployedName}' has not been deployed yet`);
        }
        // Check if the signer instance is provided by the caller
        if (userSigner !== undefined) {
            if (!ethers_1.Signer.isSigner(userSigner)) {
                throw new Error('Signer provided is not valid');
            }
            return contract.ref.connect(userSigner);
        }
        return contract.ref;
    }
    async isContractDeployedOnChain(deployedName) {
        const contract = this.getDeployedContract(deployedName);
        return (await this.provider.getCode(contract.address)) !== '0x';
    }
    isContractNameInUse(contractName) {
        return this.#deployedContracts.has(contractName);
    }
    registerDeployedContract(deployedContract) {
        this.#deployedContracts.set(deployedContract.name, deployedContract);
    }
}
exports.EvmContractManager = EvmContractManager;
