async function main() {
    // attach to contract
    const reserveNFT = await hre.ethers.getContractFactory("ReserveNFT");
    // deploy
    const nft = await reserveNFT.deploy();

    await nft.deployed();

    console.log("NFT contract deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });