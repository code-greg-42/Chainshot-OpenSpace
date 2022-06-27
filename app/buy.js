import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace";
import {ethers} from 'ethers';
import "./buy.css";
const address = "0xC1F9f8a71A66A7Ab80230E92745D63d5Ccc4Eba9";
const status = document.querySelector("#status");
const form = document.querySelector("#purchase");

const provider = new ethers.providers.Web3Provider(ethereum);

function hashInput(name, num) {
    let bytes = ethers.utils.toUtf8Bytes(name + num);
    return ethers.utils.keccak256(bytes);
}

async function buy() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, Marketplace.abi, signer);
    const nameInput = document.querySelector("#name").value;
    const numberInput = document.querySelector("#rand-num").value;
    const verificationHash = hashInput(nameInput, numberInput);
    console.log(verificationHash);
    const price = "0.1";
    const priceWei = ethers.utils.parseEther(price);
    const result = await contract.buy(12, verificationHash, {value: priceWei});
    console.log(result);
    status.innerHTML = 'Purchase Successful!'
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await buy();
    console.log('success');
})