const networkConfig = {
    11155111:{
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    137:{
        name: "polygon",
        ethUsdPriceFeed:"0x0715A7794a1dc8e42615F059dD6e406A6594651A"
    }
}
const developmentChains = ["hardhat", "localhost"]
const DECIMAL = 8
const INITIAL_ANSWER = 200000000000
module.exports = {
    networkConfig,
    developmentChains,
    DECIMAL,
    INITIAL_ANSWER
}