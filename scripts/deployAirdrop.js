async function main() {
    // attach to contract
    const airdrop = await hre.ethers.getContractFactory("ReserveAirdrop");
    // deploy
    const nft = await airdrop.deploy();

    await nft.deployed();

    console.log("NFT Airdrop contract deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });