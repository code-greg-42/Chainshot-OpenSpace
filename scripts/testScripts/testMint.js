const existingContractAddr = "0x3C16Cb7c469d93778933902bC47Bd37B6e036A6F";

async function main() {
    const nft = await hre.ethers.getContractAt("ReserveNFT", existingContractAddr);
    const tokenURI = "https://gateway.ipfs.io/ipfs/Qmf6DPd2HkP91VXuAN3DPVsByixJoYCNwb13aiWKFjCQdR"
    
    await nft.awardItem(tokenURI);
    console.log('Minting is complete!');
    }
    
    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });