"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toZeroStrippedHex = void 0;
/**
 * Hardhat closely follows the Ethereum RPC spec, which does not allow leading zeroes for hex strings
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/#quantities-encoding
 */
const ethers_1 = require("ethers");
function toZeroStrippedHex(number) {
    return ethers_1.ethers.utils.hexStripZeros(ethers_1.BigNumber.from(number).toHexString());
}
exports.toZeroStrippedHex = toZeroStrippedHex;
