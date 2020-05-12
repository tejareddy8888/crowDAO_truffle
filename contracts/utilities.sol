pragma solidity >=0.4.22 <0.7.0;

contract utilities {
        
    // this is type of an individual member of the network
    struct Member { 
                uint balance; 
                address payable maddress;
            }
    
    // This is a type for a single proposal.
    struct Proposal {
        uint256 uid;
        string name;   // short name (up to 32 bytes)
        uint256 proposalvalue;
        address payable proposer; // the member who submitted the proposal
        uint256 startingPeriod; // the period in which voting can start for this proposal
        uint256 startingPeriodFinal;
        uint256 yesVotes; // the total number of YES votes for this proposal
        uint256 yesPostVotes; //the total number of YES post approval votes
        uint256 noVotes; // the total number of NO votes for this proposal
        uint256 noPostVotes; // the total number of YES post approval votes
        bool processed; // true only if the proposal has been processed
        bool didPass; // true only if the proposal passed
        bool didfinalPass; // Final vote pass post approval
        bool aborted; // true only if applicant calls "abort" fn before end of voting period
        mapping(address => Vote) votesByMember;
        address [] votedMembers;
    }
    
    mapping (address => Member) accounts; // Calling Members account details using his address
    
     struct Voter {
                bool voted;  // if true, that person already voted
                uint vote;   // index of the voted proposal
    }

 
    address public chairperson; // Created a chairperson address
    address [] public arr;
    
    mapping(address => Voter) public voters; // Calling Voters details using his address
    
    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;
    
    uint256 proposalIndex;
        
    event SubmitProposal(uint256 proposalIndex ,address indexed proposer,  uint256 totalworth);
    event SubmitVote(uint256 indexed proposalIndex, address indexed delegateKey, address indexed memberAddress, uint8 uintVote);
    event ProcessProposal(uint256 indexed proposalIndex, address indexed applicant, address indexed memberAddress, uint256 tokenTribute, uint256 sharesRequested, bool didPass);
    
    enum Vote {
        Null, // default value, counted as abstention
        Yes,
        No
    }

    
    
}