// const { assert, expect } = require("chai")
// const {deployments, ethers, getNamedAccounts} = require("hardhat")
// // const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")


// describe("FundMe", async function() {
//     let fundMe
//     let deployer
//     let mockV3Aggregator
//     BeforeEach(async function(){
//         // deploy our fundMe contract
//         // deployer = (await getNamedAccounts()).deployer
//         // await deployments.fixture(["all"])
//         // fundMe = await ethers.getContract("FundMe", deployer)
//         // mockV3Aggregator  = await ethers.getContract(
//             // "MockV3Aggregator",
//             // deployer
//         // )
//         const fundMee = await ethers.getContractFactory("FundMe")
//         fundMe = await fundMee.deploy()
//         const mock = await ethers.getContractFactory("MockV3Aggregator")
//         mockV3Aggregator = await mock.deploy()
//     })
//     describe("constructor", async function(){
//         it("sets the aggregator address correctly", async function () {
//             const response = await fundMe.getPriceFeed()
//             assert.equal(response, mockV3Aggregator.address)
//         })
//     })

//     describe("fund", async function(){
//         it("fails if you don't send enough Eth", async function(){
//             await expect(fundMe.fund()).to.be.reverted("You need to spend more ETH!")
//         })
//     })
// // })
const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat.config")

!developmentChains.includes(network.name)
    ? describe.skip
    :
 describe("FundMe", function () {
          let fundMe
          let mockV3Aggregator
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              // const accounts = await ethers.getSigners()
              // deployer = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", function () {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })
          describe("fund" ,  function (){
            it("Fails if you not send enough Eth", async function (){
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
            })
            it("updated the amount funded data structure", async function (){
                await fundMe.fund({value: sendValue})
                const response = await fundMe.getAddressToAmountFunded(deployer)
                assert.equal(response.toString(), sendValue.toString())
            })
            it("Adds funder to array of funder", async function(){
                await fundMe.fund({value: sendValue})
                const funder = await fundMe.getFunder(0)
                assert.equal(funder,deployer)
            })
          })
          describe("withdraw", function (){
            beforeEach(async function(){
                await fundMe.fund({value: sendValue})
            })
            it("withdraw ETH from a single founder", async function(){
                // arrange
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // act

                const transactionResponse  = await fundMe.withdraw()
                const transactionReceipt =  await transactionResponse.wait(1)
                const {gasUsed, effectiveGasPrice} = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

                // assert
                assert.equal(endingFundMeBalance,0);
                assert.equal(startingFundMeBalance.add(startingDeployerBalance),endingDeployerBalance.add(gasCost).toString() )
            })
            it("allows us to withdraw with multiple getFunder ", async function (){
                const accounts = await ethers.getSigners()
                for(let i = 1;i<6;i++){
                    const fundMeConnectedContract = await fundMe.connect(accounts[i])
                    await fundMeConnectedContract.fund({value: sendValue})
                }
                const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt =  await transactionResponse.wait(1)
                const {gasUsed, effectiveGasPrice} = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)

                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
                assert.equal(endingFundMeBalance,0);
                assert.equal(startingFundMeBalance.add(startingDeployerBalance),endingDeployerBalance.add(gasCost).toString() )

                // make sure funder are reset properly
                await expect(fundMe.getFunder(0)).to.be.reverted

                for(i=1;i<6;i++){
                    assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address),0)
                }



            })
            it("only alllows the owner to withdraw", async function () {
                const accounts = await ethers.getSigners()
                const attacker = accounts[1]
                const attackerConnnectedContract = await fundMe.connect(attacker)
                await expect(attackerConnnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
            })
          })

          

          
      })
