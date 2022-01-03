const Voting = artifacts.require("voting2");
const utils = require("./helpers/utils");

contract("voting", async(accounts) => {

	let owner = accounts[0];
    let other1 = accounts[1];
    let other2 = accounts[2];

beforeEach(async () => {                     
    this.voting = await Voting.new();
    });

describe("Fonction SetRegisteringVoters", async() => {
        beforeEach( async () => {
          //  await this.voting;
            setRegisteringVoters = await this.voting.SetRegisteringVoters();//
        });
        it("Seul owner peut appeler la fonction SetRegisteringVoters", async() =>{
            await utils.shouldThrow(this.voting.SetRegisteringVoters({from: other1}));
        });
        it('la transaction doit passer', async () => {
            assert.equal(setRegisteringVoters.receipt.status, true);
        });
        it('doit changer le status de 0 a 1', async() => {
            assert.equal(setRegisteringVoters.logs[0].args.previousStatus, 0);
            assert.equal(setRegisteringVoters.logs[0].args.newStatus, 1);   
        });
        it('doit emettre event WorkflowStatusChange', async() => {
            assert.equal(setRegisteringVoters.logs[0].event, "WorkflowStatusChange");  
        });


        describe("Fonction SetProposalsRegistrationStarted", async() => {          
            
            beforeEach( async () => {
              //  await this.voting;
                await this.voting.SetRegisteringVoters();
                await this.voting.registerVoters(other1, {from: owner});
                setProposalsRegistrationStarted = await this.voting.SetProposalsRegistrationStarted();
                
            });
                it('la transaction doit revert si elle n est pas appellee par owner', async() => {
                    await utils.shouldThrow(this.voting.SetProposalsRegistrationStarted({from: other1}));
                });
                it('la transaction doit passer', async () => {             
                    assert.equal(setProposalsRegistrationStarted.receipt.status, true);
                });
                it('doit changer le status de 1 a 2', async() => {             
                    assert.equal(setProposalsRegistrationStarted.logs[0].args.previousStatus, 1);
                    assert.equal(setProposalsRegistrationStarted.logs[0].args.newStatus, 2);   
                });
                it('doit emettre event WorkflowStatusChange', async() => {        
                    assert.equal(setProposalsRegistrationStarted.logs[0].event, "WorkflowStatusChange");  
                });
        });
                        
});  
});

// JE NE COMPRENDS PAS POURQUOI CA NE FONCTIONNE PAS QUAND J ESSAI DE REFACTORISER

/* MESSAGE D ERREUR QUAND JE TEST:

 Contract: voting
    Fonction SetRegisteringVoters
      √ Seul owner peut appeler la fonction SetRegisteringVoters (2031ms)
      √ la transaction doit passer
      √ doit changer le status de 0 a 1
      √ doit emettre event WorkflowStatusChange
      Fonction SetProposalsRegistrationStarted
        1) "before each" hook for "la transaction doit revert si elle n est pas
appellee par owner"


  4 passing (9s)
  1 failing

  1) Contract: voting
       Fonction SetRegisteringVoters
         Fonction SetProposalsRegistrationStarted
           "before each" hook for "la transaction doit revert si elle n est pas
appellee par owner":
     Error: Returned error: VM Exception while processing transaction: revert
      at Context.<anonymous> (test\refactored.js:38:35)
      at processImmediate (node:internal/timers:464:21)
*/


