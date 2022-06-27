import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace";
import {ethers} from 'ethers';
const address = "0xC1F9f8a71A66A7Ab80230E92745D63d5Ccc4Eba9";
const form = document.querySelector("#verify-form");
const text = document.querySelector("#results-text");

const provider = new ethers.providers.Web3Provider(ethereum);

function hashInput(name, num) {
    return ethers.utils.id(name + num);
}

async function verify() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const nameInput = document.querySelector("#name-input").value;
    const numberInput = document.querySelector("#number-input").value;
    const tokenId = document.querySelector("#token-id").value;
    const verificationHash = hashInput(nameInput, numberInput);
    console.log(verificationHash);
    const contract = new ethers.Contract(address, Marketplace.abi, signer);
    const isVerified = await contract.verifyToken(verificationHash, tokenId);
    console.log(isVerified)
    if (isVerified) {
        text.textContent = "verified!";
    } else {
        text.textContent = "not verified";
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await verify();
});