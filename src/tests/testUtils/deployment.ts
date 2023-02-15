import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

import { BridgeV1, BridgeV1__factory, TestToken } from '../../generated';

export async function deployContracts(): Promise<BridgeDeploymentResult> {
  const accounts = await ethers.provider.listAccounts();
  const defaultAdminSigner = await ethers.getSigner(accounts[0]);
  const operationalAdminSigner = await ethers.getSigner(accounts[1]);
  const arbitrarySigner = await ethers.getSigner(accounts[2]);
  const flushReceiveSigner = await ethers.getSigner(accounts[3]);
  const BridgeUpgradeable = await ethers.getContractFactory('BridgeV1');
  const bridgeUpgradeable = await BridgeUpgradeable.deploy();
  await bridgeUpgradeable.deployed();
  const BridgeProxy = await ethers.getContractFactory('BridgeProxy');
  // deployment arguments for the Proxy contract
  const encodedData = BridgeV1__factory.createInterface().encodeFunctionData('initialize', [
    // admin address
    accounts[0],
    // operational address
    accounts[1],
    // relayer address
    accounts[0],
    // community wallet address
    accounts[4],
    30,
    // flushReceiveAddress
    accounts[3],
    // minimum days of allowance for the bridge to be operational
    2,
  ]);
  const bridgeProxy = await BridgeProxy.deploy(bridgeUpgradeable.address, encodedData);
  await bridgeProxy.deployed();
  const proxyBridge = BridgeUpgradeable.attach(bridgeProxy.address);
  // Deploying ERC20 tokens
  const ERC20 = await ethers.getContractFactory('TestToken');
  const testToken = await ERC20.deploy('Test', 'T');
  const testToken2 = await ERC20.deploy('Test2', 'T2');

  return {
    proxyBridge,
    testToken,
    testToken2,
    defaultAdminSigner,
    operationalAdminSigner,
    arbitrarySigner,
    communityAddress: accounts[4],
    flushReceiveSigner,
  };
}

interface BridgeDeploymentResult {
  proxyBridge: BridgeV1;
  testToken: TestToken;
  testToken2: TestToken;
  defaultAdminSigner: SignerWithAddress;
  operationalAdminSigner: SignerWithAddress;
  arbitrarySigner: SignerWithAddress;
  communityAddress: string;
  flushReceiveSigner: SignerWithAddress;
}
