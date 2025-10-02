
const { expect } = require("chai");


describe("DidContract", () => {
    let DidContract;
    let DidContractInstance;
    let owner, addr1;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        DidContract = await ethers.getContractFactory("DidContract")

        DidContractInstance = await DidContract.deploy()
    })
    
    it('should set did data', async () => {
        const result = await DidContractInstance.setDidData("did:ether:sealium:0x234973284", "asldfjsldkaf")
        result.wait();

          const result2 = await DidContractInstance.setWalletData("0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC", "asldfjsldkaf")
        result2.wait();
        // expect(result).to.be.true

        const data = await DidContractInstance.DidData("did:ether:sealium:0x234973284")
        const data2 = await DidContractInstance.WalletData("0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC")
        console.log(data, data2, 'walletdata')
    })

    it('should set vc data', async () => {
        const vcresult = await DidContractInstance.connect(owner).setVcData("did:ether:sealium:0x234973284", "vcTitle", "vc")
        vcresult.wait();

        const data = await DidContractInstance.VcData("did:ether:sealium:0x234973284", "vcTitle")
        console.log(data, 'vcdata')
    })

    it('should set vc data', async () => {
        const vcresult = await DidContractInstance.connect(owner).setVcData("did:ether:sealium:0x234973284", "vcTitle", "vc")
        expect(vcresult).to.be.revertedWithCustomError(DidContractInstance, "OwnableUnauthorizedAccount")
        vcresult.wait();

        const data = await DidContractInstance.VcData("did:ether:sealium:0x234973284", "vcTitle")
        console.log(data, 'vcdata')

    })
    it('should set wallet data', async () => {
    const events = await DidContractInstance.on('EventSetWalletData', (address, hashdata) => {
        console.log(address, hashdata, 'events')
    })
    const data = await DidContractInstance.WalletData(addr1.address)
    console.log(data, 'walletdata')
    // console.log(events)
    })
})

