import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const fundAmount = document.getElementById("fundAmount")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdrawFunds

//connect
async function connect() {
    if (typeof window.ethereum !== "undefined") {
      // window.web3 = new Web3(ethereum);
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      document.getElementById("connectButton").innerHTML = "Connected";
      // window.alert("Connected to Ethereum");
      // console.log("I see a metamask!")
    } else {
      document.getElementById("connectButton").innerHTML =
        "Please Install A MetaMask";
      // console.log("I don't see a metamask!")
    }
}

//getbalance
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)
      window.alert(`Balance: ${ethers.utils.formatEther(balance)}`)
      console.log(`Balance: ${ethers.utils.formatEther(balance)}`)
    }
}

//fund
async function fund(ethAmount) {
    // tx = transactionResponse
  
    console.log(`Funding with ${ethAmount} ETH`)
    ethAmount = fundAmount.value
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const tx = await contract.fund({
              value: ethers.utils.parseEther(ethAmount),
            }); 
          await listenForTransactionMine(tx, provider)
          console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    } else {

    }
}

function listenForTransactionMine(tx, provider) {
    console.log(`Mining ${tx.hash}...`)
    return new Promise((resolve, reject) => {
      provider.once(tx.hash, (transactionReceipt) => {
        console.log(
            `Completed with ${transactionReceipt.confirmations} confirmations}`
        )
        resolve()
      })
    })
}

//withdraw
async function withdrawFunds() {
  if (typeof window.ethereum !== "undefined") {
      console.log("Withdrawing...")
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const tx = await contract.withdraw()
        await listenForTransactionMine(tx, provider)
      } catch (error) {
        console.log(error)
      }


    } else {

    }
}
