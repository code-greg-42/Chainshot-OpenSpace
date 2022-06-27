async function main() {
    // attach to contract
    const marketplace = await hre.ethers.getContractFactory("Marketplace");
    // deploy
    const market = await marketplace.deploy();

    await market.deployed();

    console.log("Marketplace contract deployed to:", market.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });