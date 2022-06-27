const verificationAddress = '0x997618b67B91C8b5651257580fe7A2Aa94410336';

async function main() {
    const verification = await hre.ethers.getContractAt("SellerList", verificationAddress);
    const runVerify = await verification.submitForVerification('https://reservenft-default-rtdb.firebaseio.com', '/ethereumAddress.json', 'ReserveNFT-Test');
    console.log(runVerify);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });