import Configration from "Configration";
import { getTables } from "utils/vaultdb";

// Configure application
Configration.configure(
  "dev", 
  "us-east-1", 
  "us-east-1_aVDP9Zjz6", 
  "40nrkanvp1f20fqafrbb0t5ofh", 
  "us-east-1:9a2e5171-8653-415a-95fb-17298fad3c73");

Configration.setUserCredentials({
    jwtToken: "",
    payload:{
      sub:"",
      name: "test",
      email: "test@vaultdb.ai"
    }
  });

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe(`testing vaultdb`, () => {
  test(`using async/await`, async () => {
    const responseJson = await getTables();
    expect(responseJson).toHaveProperty(`error`, `SUCCESS`);
  });
})