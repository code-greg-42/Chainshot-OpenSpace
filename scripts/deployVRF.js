async function main() {
    // attach to contract
    const chainlinkVRF = await hre.ethers.getContractFactory("VRFv2Consumer");
    // deploy
    const vrf = await chainlinkVRF.deploy(7104);

    await vrf.deployed();

    console.log("VRF contract deployed to:", vrf.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });