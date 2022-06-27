const airdropAddress = '0x50681Cbd21D0c17827f1cBE7c7952c162C318c63';

async function main() {
    const airdrop = await hre.ethers.getContractAt("ReserveAirdrop", airdropAddress);
    const generate = await airdrop.awardRandomWinner("QmUB4izmjgDoNVAu4qQNywy9icnTzbg5vKDgNyYh9zxpBH");
    console.log(generate);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });