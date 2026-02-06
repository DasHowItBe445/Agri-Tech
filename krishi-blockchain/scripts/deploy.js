async function main() {
  const Factory = await ethers.getContractFactory("KrishiPassport");

  const contract = await Factory.deploy();

  await contract.deployed();

  console.log("Deployed at:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
