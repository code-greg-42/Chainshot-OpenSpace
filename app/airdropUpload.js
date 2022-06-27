import ReserveAirdrop from "../artifacts/contracts/ReserveAirdrop.sol/ReserveAirdrop";
import {ethers} from 'ethers';
import "./airdropUpload.css";
const { create } = require('ipfs-http-client');
const ipfs = create("https://ipfs.infura.io:5001");
const airdropAddress = '0x50681Cbd21D0c17827f1cBE7c7952c162C318c63';
const btn = document.querySelector("#btn-one");
const text = document.querySelector("#results-text");
const dropArea = document.getElementById('drop-area');
const status = document.getElementById('status');

const provider = new ethers.providers.Web3Provider(ethereum);

async function generateWinner() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(airdropAddress, ReserveAirdrop.abi, signer);
    const result = await contract.generateWinner();
    console.log(result);
    text.innerHTML = 'random winner chosen! upload the prize!';
}

btn.addEventListener('click', generateWinner);

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

async function awardWinner(tokenURI) {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(airdropAddress, ReserveAirdrop.abi, signer);
    const result = await contract.awardRandomWinner(tokenURI);
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
    await awardWinner(currentTokenURI);
    const para = document.createElement('p');
    para.textContent = 'Winner awarded!';
    para.setAttribute('id', 'status-p');
    document.body.appendChild(para);
    const nftImage = document.createElement('img');
    nftImage.setAttribute('width', '300px;');
    nftImage.setAttribute('src', gateway);
    nftImage.setAttribute('id', 'status-image');
    document.body.appendChild(nftImage);
}