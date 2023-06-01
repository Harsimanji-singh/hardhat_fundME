const {getNamedAccounts, ethers,deployments} = require("hardhat")


async function main(){
    const {deployer} = await getNamedAccounts()
    const {deploy} = deployments
    // const fundMe = await ethers.getContractAt("FundMe", deployer)
    await deploy('FundMe',{
        from:deployer,
        args:[]
    })
    console.log("funding contract....")
    const transactionResponse = await fundMe.fund({value: ethers.utils.parseEther("0.1")})
    await transactionResponse.wait(1)
    console.log("funded")
}
main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.log(error)
    process.exit(1)
})