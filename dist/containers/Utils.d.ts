/**
 * Hardhat closely follows the Ethereum RPC spec, which does not allow leading zeroes for hex strings
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/#quantities-encoding
 */
import { BigNumberish } from 'ethers';
export declare function toZeroStrippedHex(number: BigNumberish): string;
//# sourceMappingURL=Utils.d.ts.map