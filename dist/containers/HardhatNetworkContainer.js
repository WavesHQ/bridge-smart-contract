"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartedHardhatNetworkContainer = exports.HardhatNetworkContainer = void 0;
const sticky_testcontainers_1 = require("@birthdayresearch/sticky-testcontainers");
const cross_fetch_1 = __importStar(require("cross-fetch"));
const HardhatNetwork_1 = require("./HardhatNetwork");
const Utils_1 = require("./Utils");
class HardhatNetworkContainer extends sticky_testcontainers_1.GenericContainer {
    // Hardcoded image name that is created after running docker build in the smartcontracts package
    static IMAGE_NAME = 'bridge-packages/hardhatnetwork:0.0.0';
    // Default RPC port exposed by Hardhat
    static RPC_PORT = 8545;
    constructor() {
        super(HardhatNetworkContainer.IMAGE_NAME);
        // The default behaviour is to NOT auto-mine transactions
        // Any necessary auto-mines will need to be explicit by override
        this.withEnvironment({
            TRANSACTION_AUTOMINE: 'false',
        })
            .withExposedPorts(HardhatNetworkContainer.RPC_PORT)
            .withWaitStrategy(sticky_testcontainers_1.Wait.forLogMessage('Started HTTP and WebSocket JSON-RPC server at http://0.0.0.0:8545/'))
            .withStartupTimeout(180000) // 3m
            .withReuse();
    }
    async start() {
        return new StartedHardhatNetworkContainer(await super.start());
    }
}
exports.HardhatNetworkContainer = HardhatNetworkContainer;
class StartedHardhatNetworkContainer extends sticky_testcontainers_1.GenericStartedContainer {
    RPC_VERSION = '2.0';
    get rpcUrl() {
        return `http://${this.getHostAddress()}/`;
    }
    async ready() {
        // use the first pre-funded account address as the contract deployer address
        const [preFundedAccountAddress] = await this.call('eth_accounts', []);
        // Generate 1000 blocks to reduce gas fee for deployments
        await this.call('hardhat_mine', [(0, Utils_1.toZeroStrippedHex)(1000)]);
        return new HardhatNetwork_1.HardhatNetwork(this, preFundedAccountAddress);
    }
    getContainerPort() {
        return HardhatNetworkContainer.RPC_PORT;
    }
    /**
     * For convenience's sake, utility rpc for the current container.
     * JSON 'result' is parsed and returned
     * @throws TestBlockchainRpcError is raised for any errors arising from the RPC
     */
    async call(method, params) {
        const body = JSON.stringify({
            jsonrpc: this.RPC_VERSION,
            id: Math.floor(Math.random() * 100000000000000),
            method,
            params,
        });
        const text = await this.post(body);
        const { result, error } = JSON.parse(text);
        if (error !== undefined && error !== null) {
            // TODO: check what to throw here
            throw new Error(error);
        }
        return result;
    }
    /**
     * For convenience’s sake, HTTP POST to the RPC URL for the current container.
     * Not error checked, returns the raw JSON as string.
     */
    async post(body) {
        const response = await (0, cross_fetch_1.default)(this.rpcUrl, {
            method: 'POST',
            body,
            headers: new cross_fetch_1.Headers({
                'Content-Type': 'application/json',
            }),
        });
        return response.text();
    }
}
exports.StartedHardhatNetworkContainer = StartedHardhatNetworkContainer;
