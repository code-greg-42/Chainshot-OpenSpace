async function main() {
    // attach to contract
    const sellers = await hre.ethers.getContractFactory("SellerList");
    // deploy
    const sellerList = await sellers.deploy();

    await sellerList.deployed();

    console.log("Seller list contract deployed to:", sellerList.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });