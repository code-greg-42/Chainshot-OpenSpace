import ReserveNFT from "../artifacts/contracts/ReserveNFT.sol/ReserveNFT";
import {ethers} from 'ethers';
import React from 'react';
import {render} from 'react-dom';
const axios = require('axios').default;
const btn = document.querySelector("#btn");
const images = document.querySelector("#images");
const address = "0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F";

const provider = new ethers.providers.Web3Provider(ethereum);

async function fetchURI(link) {
    const result = await axios.get(link);
    return result.data;
}

function insertImages(links) {
    return (<>
    <img src={links[0]} width="200px;"/>
    <img src={links[1]} width="200px;"/>
    <img src={links[2]} width="200px;"/>
    <img src={links[3]} width="200px;"/>
    </>)
}

async function main() {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const signer = provider.getSigner();
    const myAddress = await signer.getAddress();
    const contract = new ethers.Contract(address, ReserveNFT.abi, signer);
    const filters = contract.filters.TicketCreation(myAddress);
    console.log(filters);
    const events = await contract.queryFilter(filters);
    console.log(events);
    const nftIds = [];
    for (let i = 0; i < events.length; i++) {
    console.log(events[i].args._id._hex);
    const id = events[i].args._id._hex;
    const numberId = Number.parseInt(id);
    console.log(numberId);
    nftIds.push(numberId);
    }
    console.log(nftIds);
    const imageLinks = [];
    const dataStorage = [];
    for (let i = 0; i < nftIds.length; i++) {
    const tokenLink = await contract.tokenURI(nftIds[i]);
    const tokenData = await fetchURI(tokenLink);
    const imageLink = tokenData.image;
    dataStorage.push(tokenData);
    imageLinks.push(imageLink);
    }
    console.log(imageLinks);
    console.log(dataStorage);
    render(insertImages(imageLinks), images);
}

btn.addEventListener('click', main);