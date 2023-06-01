// require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("dotenv").config()
require("hardhat-gas-reporter")
require("solidity-coverage")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
/** @type import('hardhat/config').HardhatUserConfig */

const GEORLI_RPC_URL = process.env.GEORLI_RPC_URL || "https://eth-georli"
const PRIVATE_KEY = process.env.GEORLI_PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key"
module.exports = {
  // solidity: "0.8.18",
  solidity:{
    compilers:[
      {version: "0.8.8"},
      {version: "0.6.6"}
    ]
  },
  defaultNetwork: "hardhat",
  networks:{
    georli:{
      url: GEORLI_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations:6,
    }
  },
  

  namedAccounts: {
    deployer:{
      default: 0,
    }, 
    user: {
      default : 1
    }
  },
  gasReporter:{
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    // coinmarketcap: COINMARKETCAP_API_KEY
  },
  etherscan: {
    apiKey : ETHERSCAN_API_KEY
  }
};
