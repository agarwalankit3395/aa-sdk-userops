import { LocalAccountSigner, polygonAmoy} from "@alchemy/aa-core";
import abi from "../ABI/MyToken.json";
import dotenv from "dotenv";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { Hex, encodeFunctionData } from "viem";

dotenv.config();

const PRIV_KEY = process.env.PRIV_KEY!;
const signer = LocalAccountSigner.privateKeyToAccountSigner(`0x${PRIV_KEY}`);
const contractAddr: Hex = "0x8F1f3dbFF168Ae492FB96b0bf21Da7bcEDc36bF6"; // MYToken

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
    functionName: "safeMint", // Function Name
    args: [account,"0x539af02671fc8c8455109dd7e6c02464ce7029e89ae291afunctionData05cd68ec4908514"], // Argument Parameter
  })
//Transaction performed
  const result = await client.sendUserOperation({
    uo: {
      target: contractAddr, // Smart Contract Address
      data: functionData
    }
  })

  const txHash = await client.waitForUserOperationTransaction(result);
  console.log(txHash);

})();
