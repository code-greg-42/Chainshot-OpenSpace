import ReserveNFT from "../artifacts/contracts/ReserveNFT.sol/ReserveNFT";
import "./index.css";
import {ethers} from 'ethers';
import React from 'react';
import {render} from 'react-dom';
const root = document.querySelector("#react-root");
const axios = require('axios').default;
const resultsText = document.querySelector("#results-text");
const imageSpace = document.querySelector("#image-space");
const address = "0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F";

const provider = new ethers.providers.Web3Provider(ethereum);

async function fetchImage(link) {
    const result = await axios.get(link);
    return result.data.image;
}

function insertImage(link) {
    return (<>
    <img src={link}/>
    </>)
}

async function show() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, ReserveNFT.abi, signer);
    const tokenLink = await contract.tokenURI(3);
    const imageLink = await fetchImage(tokenLink);
    resultsText.textContent = imageLink;
    render(insertImage(imageLink), imageSpace);
}

// btn.addEventListener('click', show);

function onLoad() {
    render(header, root);
};