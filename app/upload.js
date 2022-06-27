import ReserveNFT from "../artifacts/contracts/ReserveNFT.sol/ReserveNFT";
import SellerList from "../artifacts/contracts/SellerList.sol/SellerList";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace";
import {ethers} from 'ethers';
import "./upload.css";
const { create } = require('ipfs-http-client');
const ipfs = create("https://ipfs.infura.io:5001");
const verificationAddress = '0x997618b67B91C8b5651257580fe7A2Aa94410336';
const address = "0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F";
const marketAddress = "0xC1F9f8a71A66A7Ab80230E92745D63d5Ccc4Eba9";
const sellerForm = document.querySelector("#seller-verification");
const dropArea = document.getElementById('drop-area');
const status = document.getElementById('status');
const buyerForm = document.getElementById('buyer-verification');

const provider = new ethers.providers.Web3Provider(ethereum);

async function verify() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const baseUrl = document.querySelector("#base-url").value;
    const endpoint = document.querySelector("#endpoint").value;
    const companyName = document.querySelector("#company-name").value;
    const sellerList = new ethers.Contract(verificationAddress, SellerList.abi, signer);
    const result = await sellerList.submitForVerification(baseUrl, endpoint, companyName);
    console.log(result);
    status.textContent = 'verification success!';
}

sellerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await verify();
    console.log('seller verify succeeds');
});

function hashInput(name, num) {
    let bytes = ethers.utils.toUtf8Bytes(name + num);
    return ethers.utils.keccak256(bytes);
}

async function ownerVerify() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const market = new ethers.Contract(marketAddress, Marketplace.abi, signer);
    const nameInput = document.querySelector("#name-input").value;
    const numInput = document.querySelector("#number-input").value;
    const tokenId = document.querySelector("#token-id").value;
    const verificationHash = hashInput(nameInput, numInput);
    console.log(verificationHash);
    const isVerified = await market.verifyToken(verificationHash, tokenId);
    console.log(isVerified);
    if (isVerified) {
    status.textContent = 'owner verified!';
    } else {
        status.textContent = 'verification failed!';
    }
}

buyerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await ownerVerify();
})

async function ipfsUpload(buffer) {
    const result = await ipfs.add(buffer);
    return `https://gateway.ipfs.io/ipfs/${result.path}`;
}

// prevent default
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    })

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

// drag and drop highlighter
;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
})
  
;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
})
  
function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile)
  }

async function mint(tokenURI) {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, ReserveNFT.abi, signer);
    const result = await contract.awardItem(tokenURI);
    console.log(result);
}

async function uploadFile(file) {
    status.innerHTML = "Uploading...";
    const nftName = document.querySelector("#nft-name").value;
    const nftDescription = document.querySelector("#nft-description").value;
    const traitOne = document.querySelector("#trait-one").value;
    const traitTwo = document.querySelector("#trait-two").value;
    const valueOne = document.querySelector("#value-one").value;
    const valueTwo = document.querySelector("#value-two").value;
    const gateway = await ipfsUpload(file);
    const files = [{
        path: '/',
        content: JSON.stringify({
        name: nftName,
        attributes: [
        {
            "trait_type": traitOne,
            "value": valueOne
        },
        {
            "trait_type": traitTwo,
            "value": valueTwo
        }
        ],
        image: gateway,
        description: nftDescription,
        })
    }];
    const result = await ipfs.add(files);
    console.log(result);
    status.innerHTML = 'Upload Successful!';
    console.log(gateway);
    console.log(result.path);
    const currentTokenURI = result.path;
    await mint(currentTokenURI);
    const para = document.createElement('p');
    para.setAttribute('id', 'status-p');
    para.textContent = 'Minting Complete!';
    document.body.appendChild(para);
    const nftImage = document.createElement('img');
    nftImage.setAttribute('width', '200px;');
    nftImage.setAttribute('src', gateway);
    nftImage.setAttribute('id', 'status-image');
    document.body.appendChild(nftImage);
    
}