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
            await this.voting;
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
   });         

	describe("Fonction registerVoters", async() => {
	    beforeEach( async () => {
	        await this.voting;
	        await this.voting.SetRegisteringVoters();
	        registerVotersInstance = await this.voting.registerVoters(other1, {from: owner});///
	    });
	        it('la transaction doit passer', async () => {
	            assert.equal(registerVotersInstance.receipt.status, true);
	            });
	        it('Seul owner peut appeler la fonction registerVoters', async() => {
	           await utils.shouldThrow(this.voting.registerVoters(other2, {from: other1}));
	        });
	        it('l addresse du voter enregistrée doit etre other1', async() => {
	            assert.equal(registerVotersInstance.logs[0].args.voterAddress, other1);
	        });
	        it('doit emettre event VoterRegistered', async() => {
	            assert.equal(registerVotersInstance.logs[0].event, "VoterRegistered");
	        });                
    });  

	describe("Fonction SetProposalsRegistrationStarted", async() => {          
                            
        beforeEach( async () => {
        	await this.voting;
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


	describe('Fonction addProposal', async () => {
       
        beforeEach( async () => {
           await this.voting;
	       await this.voting.SetRegisteringVoters();
	       await this.voting.registerVoters(other1, {from: owner});
           await this.voting.SetProposalsRegistrationStarted();
           addProposalInstance = await this.voting.addProposal("oui", {from: other1});        
        });
    	    it('la transaction doit revert si elle n est pas appellee par un voter', async() => {
                await utils.shouldThrow(this.voting.addProposal("oui", {from: other2}));
            });
            it('la transaction doit passer', async () => {                             
                const addProposalInstance = await this.voting.addProposal("oui", {from: other1});              
                assert.equal(addProposalInstance.receipt.status, true);
            });
            it('doit emettre event ProposalRegistered', async() => {                                               
                assert.equal(addProposalInstance.logs[0].event, "ProposalRegistered");  
            });
    });

	describe("change le status ProposalsRegistrationStarted a SetProposalsRegistrationEnded", async() => {                  
        //CA PLANTE QUAND JE REFACTORISE AVEC LE BEFORE EACH                             
       // beforeEach( async () => {
       //     await this.voting;
       //     await this.voting.SetRegisteringVoters();
       //     await this.voting.registerVoters(other1, {from: owner});
       //     await this.voting.SetProposalsRegistrationStarted();
            
        //    await this.voting.addProposal("oui", {from: other1});
       //     setProposalsRegistrationEnded = await this.voting.SetProposalsRegistrationEnded();
       // });  
            it('la transaction doit revert si elle n est pas appellee par owner', async() => {
                await this.voting;
                await this.voting.SetRegisteringVoters();
                await this.voting.registerVoters(other1, {from: owner});
                await this.voting.SetProposalsRegistrationStarted();
                await this.voting.addProposal("oui", {from: other1});
                await utils.shouldThrow(this.voting.SetProposalsRegistrationEnded({from: other1}));
            });     
            it('la transaction doit passer', async () => {
                await this.voting;
                await this.voting.SetRegisteringVoters();
                await this.voting.SetProposalsRegistrationStarted();
                const setProposalsRegistrationEnded = await this.voting.SetProposalsRegistrationEnded();                             
                assert.equal(setProposalsRegistrationEnded.receipt.status, true);
            });
            it('doit changer le status de 2 a 3', async() => {
                await this.voting;
                await this.voting.SetRegisteringVoters();
                await this.voting.SetProposalsRegistrationStarted();
                const setProposalsRegistrationEnded = await this.voting.SetProposalsRegistrationEnded();               
                assert.equal(setProposalsRegistrationEnded.logs[0].args.previousStatus, 2);
                assert.equal(setProposalsRegistrationEnded.logs[0].args.newStatus, 3);   
            });
            it('doit emettre event WorkflowStatusChange', async() => {
                await this.voting;
                await this.voting.SetRegisteringVoters();
                await this.voting.SetProposalsRegistrationStarted();
                const setProposalsRegistrationEnded = await this.voting.SetProposalsRegistrationEnded();             
                assert.equal(setProposalsRegistrationEnded.logs[0].event, "WorkflowStatusChange");                 
            }); 
    });

    describe("change le status SetProposalsRegistrationEnded a SetVotingSessionStarted", async() => {                  
        beforeEach( async () => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            setVotingSessionStarted = await this.voting.SetVotingSessionStarted();       
        });
        it('la transaction doit passer', async () => {                             
            assert.equal(setVotingSessionStarted.receipt.status, true);
        });
        it('doit changer le status de 3 a 4', async() => {               
            assert.equal(setVotingSessionStarted.logs[0].args.previousStatus, 3);
            assert.equal(setVotingSessionStarted.logs[0].args.newStatus, 4);   
        });
        it('doit emettre event WorkflowStatusChange', async() => {             
            assert.equal(setVotingSessionStarted.logs[0].event, "WorkflowStatusChange");  
        });

    });




   describe('doit pouvoir voter pour la proposition 1', async () => {
      // beforeEach( async () => {
      //      await this.voting;
      //      await this.voting.SetRegisteringVoters();
      //      await this.voting.registerVoters(other1, {from: owner});
      //      await this.voting.SetProposalsRegistrationStarted();
      //      await this.voting.addProposal("oui", {from: other1}); 
      //      await this.voting.SetProposalsRegistrationEnded();
      //      await this.voting.SetVotingSessionStarted(); 
      //      voteInstance = await this.voting.vote(1, {from: other1});      
      //  });
        it('doit throw quand le vote n exite pas', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            //const voteInstance = await this.voting.vote(1, {from: other1});
            await utils.shouldThrow(this.voting.vote(1, {from: other2}));
        });
        it('doit throw quand le voter n est pas whitelist', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            //const voteInstance = await this.voting.vote(1, {from: other1});
            await utils.shouldThrow(this.voting.vote(1, {from: other2}));
        });
        it("doit pouvoir voter", async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            const voteInstance = await this.voting.vote(1, {from: other1});                                               
           assert.equal(voteInstance.receipt.status, true);
        });
        it("doit emettre event Voted", async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            const voteInstance = await this.voting.vote(1, {from: other1});
            assert.equal(voteInstance.logs[0].event, "Voted");
        });
    
    });

   describe("change le status SetVotingSessionStarted a SetVotingSessionEnded", async() => {                  
       // beforeEach( async () => {
       //     await this.voting;
       //     await this.voting.SetRegisteringVoters();
       //     await this.voting.registerVoters(other1, {from: owner});
       //     await this.voting.SetProposalsRegistrationStarted();
       //     await this.voting.addProposal("oui", {from: other1}); 
       //     await this.voting.SetProposalsRegistrationEnded();
       //     await this.voting.SetVotingSessionStarted();
       //     await this.voting.vote(1, {from: other1});
       //     setVotingSessionEnded = await this.voting.SetVotingSessionEnded();
       // });
        it('la transaction doit revert si elle n est pas appellee par owner', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
           // const setVotingSessionEnded = await this.voting.SetVotingSessionEnded();
            await utils.shouldThrow(this.voting.SetVotingSessionEnded({from: other1}));
            });       
        it('la transaction doit passer', async () => { 
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
            const setVotingSessionEnded = await this.voting.SetVotingSessionEnded();                            
            assert.equal(setVotingSessionEnded.receipt.status, true);
        });
        it('doit changer le status de 4 a 5', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
            const setVotingSessionEnded = await this.voting.SetVotingSessionEnded();               
            assert.equal(setVotingSessionEnded.logs[0].args.previousStatus, 4);
            assert.equal(setVotingSessionEnded.logs[0].args.newStatus, 5);   
            });
        it('doit emettre event WorkflowStatusChange', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
            const setVotingSessionEnded = await this.voting.SetVotingSessionEnded();             
            assert.equal(setVotingSessionEnded.logs[0].event, "WorkflowStatusChange");                 
        }); 
    });

   describe("change le statusSetVotingSessionEnded a SetVotesTallied", async() => {                  
       // beforeEach( async () => {
       //     await this.voting;
       //     await this.voting.SetRegisteringVoters();
       //     await this.voting.registerVoters(other1, {from: owner});
       //     await this.voting.SetProposalsRegistrationStarted();
       //     await this.voting.addProposal("oui", {from: other1}); 
       //     await this.voting.SetProposalsRegistrationEnded();
       //     await this.voting.SetVotingSessionStarted();
       //     await this.voting.vote(1, {from: other1});
       //     setVotingSessionEnded = await this.voting.SetVotingSessionEnded();
       // });
        it('la transaction doit revert si elle n est pas appellee par owner', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
            await this.voting.SetVotingSessionEnded();
           // const setVotingSessionEnded = await this.voting.SetVotingSessionEnded();
            await utils.shouldThrow(this.voting.SetVotesTallied({from: other1}));
            });       
        it('la transaction doit passer', async () => { 
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
            await this.voting.SetVotingSessionEnded();
            const setVotesTallied = await this.voting.SetVotesTallied();                            
            assert.equal(setVotesTallied.receipt.status, true);
        });
        it('doit changer le status de 4 a 5', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
            await this.voting.SetVotingSessionEnded();
            const setVotesTallied = await this.voting.SetVotesTallied();               
            assert.equal(setVotesTallied.logs[0].args.previousStatus, 5);
            assert.equal(setVotesTallied.logs[0].args.newStatus, 6);   
            });
        it('doit emettre event WorkflowStatusChange', async() => {
            await this.voting;
            await this.voting.SetRegisteringVoters();
            await this.voting.registerVoters(other1, {from: owner});
            await this.voting.SetProposalsRegistrationStarted();
            await this.voting.addProposal("oui", {from: other1}); 
            await this.voting.SetProposalsRegistrationEnded();
            await this.voting.SetVotingSessionStarted();
            await this.voting.vote(1, {from: other1});
            await this.voting.SetVotingSessionEnded();
            const setVotesTallied = await this.voting.SetVotesTallied();             
            assert.equal(setVotesTallied.logs[0].event, "WorkflowStatusChange");                 
        }); 
    });
});



