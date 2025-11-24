import * as fs from "fs";
import * as path from "path";

async function main() {
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const abisDir = path.join(__dirname, "../abis");

  if (!fs.existsSync(abisDir)) {
    fs.mkdirSync(abisDir, { recursive: true });
  }

  // Copy IPAssetRegistry ABI
  const ipAssetRegistryArtifact = JSON.parse(
    fs.readFileSync(
      path.join(artifactsDir, "IPAssetRegistry.sol/IPAssetRegistry.json"),
      "utf8"
    )
  );
  fs.writeFileSync(
    path.join(abisDir, "IPAssetRegistry.json"),
    JSON.stringify(ipAssetRegistryArtifact.abi, null, 2)
  );

  // Copy LicensingModule ABI
  const licensingModuleArtifact = JSON.parse(
    fs.readFileSync(
      path.join(artifactsDir, "LicensingModule.sol/LicensingModule.json"),
      "utf8"
    )
  );
  fs.writeFileSync(
    path.join(abisDir, "LicensingModule.json"),
    JSON.stringify(licensingModuleArtifact.abi, null, 2)
  );

  console.log("✅ ABIs generated in abis/ directory");
}

main().catch(console.error);

