// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting2 is Ownable{
    
    
    uint proposalId = 0 ;
    Proposal winner;
    WorkflowStatus status = WorkflowStatus.NotStarted; 
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }
    
    enum WorkflowStatus {
        NotStarted,
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    
    mapping(address => Voter) Voters;    
    mapping(uint => Proposal) proposals;
    
    
    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint indexed proposalId);
    event Voted (address voter, uint indexed proposalId);

    function SetRegisteringVoters()public onlyOwner{
        require(status == WorkflowStatus.NotStarted);
        status = WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange( WorkflowStatus.NotStarted, WorkflowStatus.RegisteringVoters);
    } 
   
   function SetProposalsRegistrationStarted () public onlyOwner{
        require(status == WorkflowStatus.RegisteringVoters);
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange( WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }
    
    function SetProposalsRegistrationEnded () public onlyOwner{
        require(status == WorkflowStatus.ProposalsRegistrationStarted);
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange( WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }
    
    function SetVotingSessionStarted() public onlyOwner{
        require(status == WorkflowStatus.ProposalsRegistrationEnded);
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange( WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
    
    function SetVotingSessionEnded() public onlyOwner{
        require(status == WorkflowStatus.VotingSessionStarted);
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange( WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }
    
    function SetVotesTallied() public onlyOwner{
        require(status == WorkflowStatus.VotingSessionEnded);
        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange( WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
    
    function registerVoters(address voterAddress) public  onlyOwner{
        require( status == WorkflowStatus.RegisteringVoters,"Not the time registering voters"); 
        (Voters[voterAddress]).isRegistered = true;
        emit VoterRegistered(voterAddress);
    }
    
    function addProposal( string memory _description)public {
        require( status == WorkflowStatus.ProposalsRegistrationStarted);
        require((Voters[msg.sender]).isRegistered == true);
        proposalId++;
        proposals[proposalId] = Proposal(_description, 0);
        emit ProposalRegistered( proposalId);
    }
    
    function vote (uint _proposalId)public { 
        require( status == WorkflowStatus.VotingSessionStarted,"Not the time for vote or user can t vote");
        require((Voters[msg.sender]).isRegistered == true);
        require((Voters[msg.sender]).hasVoted == false);
        (proposals[_proposalId]).voteCount++;
        (Voters[msg.sender]).hasVoted = true;
        (Voters[msg.sender]).votedProposalId = _proposalId;
        if((proposals[_proposalId]).voteCount > winner.voteCount){
            winner = proposals[_proposalId];
        }
        emit Voted (msg.sender, _proposalId);
    }

    function getWinner() public view returns (Proposal memory){
        return winner;
    }

}    
