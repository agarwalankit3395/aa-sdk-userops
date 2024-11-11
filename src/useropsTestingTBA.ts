import { LocalAccountSigner, arbitrumSepolia, polygonAmoy } from "@alchemy/aa-core";
// import Example from "../artifacts/Example.json";
import abi from "../ABI/ERC6551REGISTERY.json";
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
// const contractAddr: Hex = "0x7920b6d8b07f0b9a3b96f238c64e022278db1419";
const contractAddr: Hex = "0x9Ac375A25ef2A3cC9d8119acA4483d551628d350"; // ERC6551Registery

(async () => {
  // modular account client
  const client = await createModularAccountAlchemyClient({
    apiKey: process.env.ALCHEMY_API_KEY!,
    chain: polygonAmoy,
    signer,
    gasManagerConfig: {
      policyId: process.env.POLICY_ID!,
    },
  });

  const cd = encodeFunctionData({
    abi,
    functionName: "createAccount",
    args: ["0x01FE0E42DF6524727a7Ee62E3fb6e6CC07fF4594","0x4723c0bd4a6bc92fc353a0d067b3c444fbc2688f522ddd89ccae5a1303020a1e","80002","0x8783d99fF5439005F6e5198c9AfF5Cf329E75300","5"],
  })
//Transaction performed
  const result = await client.sendUserOperation({
    uo: {
      target: contractAddr,
      data: cd
    }
  })

  // const uos = [1, 2, 3, 4, 5, 6, 7].map((x) => {
  //   return {
  //     target: contractAddr,
  //     data: encodeFunctionData({
  //       abi,
  //       functionName: "safeMint",
  //       args: [x],
  //     }),
  //   };
  // });

  // const result = await client.sendUserOperation({
  //   uo: uos,
  // });
  const txHash = await client.waitForUserOperationTransaction(result);
  console.log(txHash);

  // const x = await client.readContract({
  //   abi,
  //   address: contractAddr,
  //   functionName: "x",
  // });

  // console.log(x);
})();
