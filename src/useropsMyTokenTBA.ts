import { LocalAccountSigner, polygonAmoy} from "@alchemy/aa-core";
import abi from "../ABI/BASIC_NFT.json";
import dotenv from "dotenv";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { Hex, encodeFunctionData } from "viem";

dotenv.config();

// const { abi } = Example["contracts"]["contracts/Example.sol:Example"];
const PRIV_KEY = process.env.PRIV_KEY!;
// signer (userop) -> bundler eoa (transaction [userop,userop]) -> EP -> sca -> contract
// const provider = new ethers.JsonRpcProvider(process.env.AMOY_TESTNET_URL);
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${PRIV_KEY}`);
const contractAddr: Hex = "0x8783d99fF5439005F6e5198c9AfF5Cf329E75300"; // MYToken

(async () => {
  const account = await signer.getAddress()
  console.log(account);
  // modular account client
  const client = await createModularAccountAlchemyClient({
    apiKey: process.env.ALCHEMY_API_KEY!,
    chain: polygonAmoy,  //Chain Id
    signer, // User Signer Address
    gasManagerConfig: {
      policyId: process.env.POLICY_ID!, // Find in Alchemy Dashboard under Alchemy Gas Policy
    },
  });

  const functionData = encodeFunctionData({
    abi,
    functionName: "mint", // Function Name  // Argument Parameter
  })
//Transaction performed
  const result = await client.sendUserOperation({
    uo: {
      target: contractAddr, // Smart Contract Address
      data: functionData
    }
  })

  console.log(result);

  const txHash = await client.waitForUserOperationTransaction(result);
  console.log(txHash);

})();
