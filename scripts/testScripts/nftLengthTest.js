const nftAddress = '0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F';

async function main() {
    const nftBase = await hre.ethers.getContractAt("ReserveNFT", nftAddress);
    const nftLength = await nftBase.nftListLength();
    console.log(nftLength);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });