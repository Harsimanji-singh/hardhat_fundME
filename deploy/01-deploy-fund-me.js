const {networkConfig, developmentChains} = require("../helper-hardhat.config")
const {network} = require("hardhat")
const {verify}  = require("../Utils/verify")
// const { DEBUG_FILE_FORMAT_VERSION } = require("hardhat/internal/constants")
module.exports = async ({getNamedAccounts, deployments})=>{
    const {deploy, log} = deployments
    const { deployer} = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log(chainId)

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)){
        const ehtUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ehtUsdAggregator.address
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
// if the contract doesn't exist, we deploy a minimal version of it for our local testing
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe",{
        from : deployer,
        args : args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConformations || 1
    })

    if(
        !developmentChains.includes(network.name) && 
        process.env.ETHERSCAN_API_KEY
    ){
        await verify(fundMe.address,args)
    }


    log("--------------------------------")
}
module.exports.tags = ["all", "fundme"]