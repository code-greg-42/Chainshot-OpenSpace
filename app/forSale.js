import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace";
import ReserveNFT from "../artifacts/contracts/ReserveNFT.sol/ReserveNFT";
import {ethers} from 'ethers';
import "./forSale.css";
const marketAddress = "0xC1F9f8a71A66A7Ab80230E92745D63d5Ccc4Eba9";
const nftAddress = "0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F";
const form = document.querySelector("#sale");
const status = document.querySelector("#status");
const approveBtn = document.querySelector("#approve-btn");

const provider = new ethers.providers.Web3Provider(ethereum);

async function listForSale() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(marketAddress, Marketplace.abi, signer);
    const nftContract = new ethers.Contract(nftAddress, ReserveNFT.abi, signer);
    const price = document.querySelector("#price").value;
    const priceWei = ethers.utils.parseEther(price);
    const nftResult = await nftContract.approve(marketAddress, 12);
    console.log(nftResult);
    const result = await marketContract.sell(12, priceWei);
    console.log(result);
    status.innerHTML = 'Sale Listed!';
}

async function approveForSale() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(nftAddress, ReserveNFT.abi, signer);
    const nftResult = await nftContract.approve(marketAddress, 12);
    console.log(nftResult);
    status.innerHTML = 'Sale Approved!';
}

approveBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    approveForSale();
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await listForSale();
    console.log('success');
})