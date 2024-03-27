// This hook is used to approve the marketplace contract to spend the user's cUSD tokens

// Import the wagmi hooks to prepare and write to a smart contract
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
// Import the ERC20 ABI(Interface)
import Erc20Instance from "../../abi/erc20.json";
// Import the Marketplace ABI(Interface)
import MarketplaceInstance from "../../abi/Marketplace.json";
// Import BigNumber from ethers to handle big numbers used in Celo
import {BigNumber} from "ethers";

// write to a smart contract
export const useContractApprove = (price: number | string) => {
    // The gas limit to use when sending a transaction
    const gasLimit = BigNumber.from(1000000);
    // Prepare the write to the smart contract
    const { config } = usePrepareContractWrite({
        // The address of the smart contract, in this case the ERC20 cUSD token address from the JSON file
        address: Erc20Instance.address as `0x${string}`,
        // The ABI of the smart contract, in this case the ERC20 cUSD token address from the JSON file
        abi: Erc20Instance.abi,
        // The smart contract function name to call
        functionName: 'approve',
        // The arguments to pass to the smart contract function, in this case the Marketplace address and the product price
        args: [MarketplaceInstance.address, price],
        // The gas limit to use when sending a transaction
        overrides: {
            gasLimit
        },
        onError: (err) => {
            console.log({ err })
        }
    })

    // Write to the smart contract using the prepared config
    const { data, isSuccess, write, writeAsync, error, isLoading } = useContractWrite(config)
    return { data, isSuccess, write, writeAsync, isLoading }
}