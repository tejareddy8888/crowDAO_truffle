pragma solidity >=0.4.22 <0.7.0;

import "./utilities.sol";

contract crowdao is utilities{
    
// constructor initialising the Chairperson and proposalIndex.
constructor() public {
        chairperson = address(this);
        proposalIndex = 0;
        accounts[chairperson].balance = 0;
        accounts[chairperson].maddress = payable(chairperson);
}


        
// Bank and Amount transfer in ETH 


        function selfAdd(uint256 value) external returns(uint256) {
                require(value > 10, "Deposit shall be greater than 10 Ether");
                 /*
                      Function Adds the caller only if he is giving depositing greater than 10 ETH in the network.
                      takes Proposal string and proposal worth value as input.
                */
                accounts[msg.sender].balance += value;
                accounts[msg.sender].maddress = payable(msg.sender);
                return accounts[msg.sender].balance;
            }
            
        function invest() external payable returns(bool) {
                //adding balance in chairperson account in accounts
                accounts[chairperson].balance += msg.value;
                //adding balance in self account in accounts
                accounts[msg.sender].balance += msg.value;
                //adding address as a member
                accounts[msg.sender].maddress = payable(msg.sender);
               return true;
            } 
            
        function BalanceOfchairperson() external view returns(uint256){
                return chairperson.balance;
            }
        
        function BalanceOfmember(address payable _member) external view returns(uint){
                return address(_member).balance;
            }
            
        function getBalance(address addr) external view returns (uint256) {
                return accounts[addr].balance;
            }
        function Transfer(address payable  _to,  uint _value)  public  payable{
                require(accounts[chairperson].balance >= _value,"Chairman does not have funds with ");
                     accounts[chairperson].balance -= _value;
                    accounts[_to].balance -= _value;
                    _to.transfer(_value);
            }        
        function ProposalFundBlock(uint256 _proposalIndex, address memaddr) public  
            {
                uint256 value =  ComputeTotalShare(_proposalIndex);
                Transfer(payable(memaddr),value);
                accounts[memaddr].balance -= value;
                
            }
            
                function refundFunds(uint256 proposalIndex) public returns(bool)
                {
                    address payable sender = proposals[proposalIndex].proposer;
                    uint256 value =  proposals[proposalIndex].proposalvalue;
                    uint256 len = proposals[proposalIndex].votedMembers.length;
                        if(len > 0){
                            for (uint i=0; i<len-1; i++) {
                                if(accounts[sender].balance >= value) {
                                accounts[sender].balance -= value;
                                accounts[proposals[proposalIndex].votedMembers[i]].balance += value;
                            }  
                        
                        }
                    
                    }
                    return true;
                }
            
            modifier CheckBalance{
                require(accounts[msg.sender].balance >= 10, "You cannot perform this actions as you have insufficient balance");
                _;
            }
        
            modifier onlyAcccountHolder {
                require(accounts[msg.sender].maddress == msg.sender, "You cannot perform this actions as you are not a member");
                _;
            }
            modifier checkProposalValue(uint256 value){
                //checkProposalValue(_proposalworth) 
                require(value >  accounts[chairperson].balance, "You cannot perform this actions as you are not a member");
                _;
            }
            
function addProposal(string memory _proposalname , uint256  _proposalworth) onlyAcccountHolder public returns(bool){
        /*
              function Adds Proposals based on the condition of the only if he is a member of the network.
              takes Proposal string and proposal worth value as input.
        */
     proposalIndex +=1;
     proposals.push(Proposal({uid : proposalIndex,
                              name: _proposalname,
                              proposalvalue: _proposalworth,
                              startingPeriod: now,
                              yesVotes:0,
                              yesPostVotes:0,
                              noVotes:0,
                              noPostVotes:0,
                              processed:false,
                              didPass:false,
                              aborted:false,
                              didfinalPass:false,
                              proposer:payable(msg.sender),
                              votedMembers: arr
                    
     }));  
     emit SubmitProposal(proposalIndex,msg.sender,_proposalworth);
     return true;
    }
    
function proposalCount() public view returns(uint) { return proposals.length; }


function FetchProposalIndex(string memory _proposalname , uint256  _proposalworth) public view returns (uint256){
        
        for (uint i=0; i<proposals.length; i++) {
            if(keccak256(abi.encodePacked(proposals[i].name)) == keccak256(abi.encodePacked(_proposalname)) && proposals[i].proposalvalue == _proposalworth)
            return(proposals[i].uid);
            }
    }

    function getProposalByIndex(uint256  _index) public view returns (uint256,  string memory, uint256, uint256, uint256, bool, address){
        
        
            return(proposals[_index].uid , proposals[_index].name, proposals[_index].proposalvalue, proposals[_index].yesVotes, proposals[_index].noVotes, proposals[_index].didPass, proposals[_index].proposer);
            
    }

    function getProposalCount() public view returns(uint count) 
    { return proposals.length;
    }

    function hasProposalPassed(uint256 _proposalIndex) public returns (bool){
     // This function checks if the particular proposal passed or fail by 60% percentage cutoff.     
     uint256 sum_votes = proposals[_proposalIndex].yesVotes + proposals[_proposalIndex].noVotes;
     if((proposals[_proposalIndex].yesVotes/ sum_votes)* 100 >= (60))
        {proposals[_proposalIndex].didPass = true; 
        return true;}
     else
     {  proposals[_proposalIndex].didPass = false;
        return false;}
    }
    
    function hasVotingPeriodExpired(uint256 _proposalIndex) public view returns (bool) {
        //This function checks for the voting period expiration for the proposal for 20 sec
        uint256 start = proposals[_proposalIndex].startingPeriod;
        return (now - start) >= 20;
    }
    
    function ComputeTotalShare(uint256 _proposalIndex) public view returns(uint256){
        
        uint256 worth = proposals[_proposalIndex].proposalvalue;
        uint256 totalvote = proposals[_proposalIndex].votedMembers.length;
        require(worth >= totalvote,"The proposal worth is too low");
        
        return worth/totalvote;
        
    }
    
     

    function submitVote(uint256 proposalIndex, uint8 uintVote) public {
    //    Member storage member = members[msg.sender];
         address memberAddress = msg.sender;
    //     require(uintVote < 3, "Moloch::submitVote - uintVote must be less than 3");
        Vote vote = Vote(uintVote);

    //     //require(getCurrentPeriod() >= proposal.startingPeriod, "Moloch::submitVote - voting period has not started");
    //     //require(!hasVotingPeriodExpired(proposal.startingPeriod), "Moloch::submitVote - proposal voting period has expired");
         require(proposals[proposalIndex].votesByMember[memberAddress] == Vote.Null, "Moloch::submitVote - member has already voted on this proposal");
         require(vote == Vote.Yes || vote == Vote.No, "Moloch::submitVote - vote must be either Yes or No");
        // store vote
         proposals[proposalIndex].votesByMember[memberAddress] = vote;
         proposals[proposalIndex].votedMembers.push(memberAddress);

    //    Adding counts to respective Yes or No
         if (vote == Vote.Yes) {
            proposals[proposalIndex].yesVotes  += 1;

         } else if (vote == Vote.No) {
            proposals[proposalIndex].noVotes += 1;
         }
         ProposalFundBlock(proposalIndex,msg.sender);
         emit SubmitVote(proposalIndex, msg.sender, memberAddress, uintVote);
     }
    

    function submitPassedVote(uint256 proposalIndex, uint8 uintVote) public {
        //This function 
         address memberAddress = msg.sender;
         Vote postVote = Vote(uintVote);
         require(proposals[proposalIndex].votesByMember[memberAddress] == Vote.Null, "Moloch::submitVote - member has already voted on this proposal");
         

    //    Adding counts to respective Yes or No
         if (postVote == Vote.Yes) {
            proposals[proposalIndex].yesPostVotes  += 1;

         } else if (postVote == Vote.No) {
            proposals[proposalIndex].noPostVotes += 1;
         }
         
         emit SubmitVote(proposalIndex, msg.sender, memberAddress, uintVote);
     }

     
    
   

    
}