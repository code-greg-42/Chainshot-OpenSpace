const verificationAddress = '0x65A64a17eEc885C0858CBB9fC55d17CB8e8e78bC';

async function main() {
    const verification = await hre.ethers.getContractAt("VRFv2Consumer", verificationAddress);
    const vrf = await verification.s_randomNumber();
    console.log(vrf);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });