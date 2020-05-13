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
        
        function MembersWalletBalance(address payable _member) external view returns(uint){
                return address(_member).balance;
            }
            
        function getBalance(address addr) external view returns (uint256) {
                return accounts[addr].balance;
            }
        function Transfer(address payable  _to,  uint _value)  public  payable{
                require(accounts[chairperson].balance >= _value,"Chairman does not have funds with ");
                     accounts[chairperson].balance -= _value;
                    //accounts[_to].balance += _value;
                    _to.transfer(_value);
            }        
        function ProposalFundBlock(uint256 _proposalIndex) public  
            {
                uint256 value =  ComputeTotalShare(_proposalIndex);
                uint256 len = proposals[_proposalIndex].votedMembers.length;
                if(len > 0){
                    for (uint i=0; i<len-1; i++) {
                        if(accounts[proposals[_proposalIndex].votedMembers[i]].balance >= value) {
                        //accounts[chairperson].balance += value;
                        accounts[proposals[_proposalIndex].votedMembers[i]].balance -= value;
                    }  
                }
                }
                
            }
        
        function isProposer(uint256 _proposalIndex) public view returns(bool) {
           return proposals[_proposalIndex].proposer == msg.sender;
        }
            
        function refundFunds(uint256 proposalIndex) public returns(bool)
        {
            uint256 value = ComputeTotalShare(proposalIndex);
            uint256 len = proposals[proposalIndex].votedMembers.length;
                if(len > 0){
                    for (uint i=0; i<len-1; i++) {
                        if(accounts[chairperson].balance >= value) {
                        //accounts[chairperson].balance -= value;
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

     proposals.push(Proposal({uid : proposalIndex,
                              name: _proposalname,
                              proposalvalue: _proposalworth,
                              startingPeriod: now,
                              startingPeriodFinal:0,
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
     proposalIndex +=1;
     emit SubmitProposal(proposalIndex,msg.sender,_proposalworth);
     return true;
    }
    
function getProposalCount() public view returns(uint256) {  return proposals.length;}

function didProposalPass(uint256 _proposalIndex) public view returns(bool) { return  proposals[_proposalIndex].didPass;}

function didProposalFinalPass(uint256 _proposalIndex) public view returns(bool) { return  proposals[_proposalIndex].didfinalPass;}

function didProposalProcessed(uint256 _proposalIndex) public view returns(bool) { return  proposals[_proposalIndex].processed;}

function didProposalAborted(uint256 _proposalIndex) public view returns(bool) { return  proposals[_proposalIndex].aborted;}

function fetchProposalShare(uint256 _proposalIndex) public view returns(uint256) { return  ComputeTotalShare(_proposalIndex);}

// function FetchProposalIndex(string memory _proposalname , uint256  _proposalworth) public view returns (uint256){
        
//         for (uint i=0; i<proposals.length; i++) {
//             if(keccak256(abi.encodePacked(proposals[i].name)) == keccak256(abi.encodePacked(_proposalname)) && proposals[i].proposalvalue == _proposalworth)
//             return(proposals[i].uid);
//             }
//     }

function getProposalByIndex(uint256  _index) public view returns (uint256,  string memory, uint256, uint256, uint256, bool, address){
        
        
            return(proposals[_index].uid , proposals[_index].name, proposals[_index].proposalvalue, proposals[_index].yesVotes, proposals[_index].noVotes, proposals[_index].didPass, proposals[_index].proposer);
            
    }
function getProposalByIndex2(uint256  _index) public view returns (uint256,  string memory, uint256, bool, uint256, uint256,address){
        
        
            return(proposals[_index].uid , proposals[_index].name, proposals[_index].proposalvalue, proposals[_index].processed, proposals[_index].yesPostVotes, proposals[_index].noPostVotes, proposals[_index].proposer);
            
    }



function hasProposalPassed(uint256 _proposalIndex) public returns (bool){
     // This function checks if the particular proposal passed or fail by 60% percentage cutoff.     
     //uint256 sum_votes = proposals[_proposalIndex].yesVotes + proposals[_proposalIndex].noVotes;
     //if((proposals[_proposalIndex].yesVotes/ sum_votes)* 100 >= (60))
     if(proposals[_proposalIndex].yesVotes > proposals[_proposalIndex].noVotes)
     {
        proposals[_proposalIndex].didPass = true; 
        ProposalFundBlock(_proposalIndex);
        return true;
            
        }
     else
     {  proposals[_proposalIndex].didPass = false;
        //ProposalFundBlock(_proposalIndex);
        proposals[_proposalIndex].aborted = true;
        return false;}
    }

function hasProposalPassedFinal(uint256 _proposalIndex) public returns (bool){
     // This function checks if the particular proposal passed or fail by 60% percentage cutoff.     
     //uint256 sum_votes = proposals[_proposalIndex].yesVotes + proposals[_proposalIndex].noVotes;
     //if((proposals[_proposalIndex].yesVotes/ sum_votes)* 100 >= (60))
     if(proposals[_proposalIndex].yesPostVotes > proposals[_proposalIndex].noPostVotes)
        {proposals[_proposalIndex].didfinalPass = true; 
        Transfer(proposals[_proposalIndex].proposer,proposals[_proposalIndex].proposalvalue);
        return true;}
     else
     {  proposals[_proposalIndex].didfinalPass = false;
        proposals[_proposalIndex].aborted = true;
        refundFunds(_proposalIndex);
        return false;}
    }
function fetchBlockNumber() public view returns(uint256)
{
    return block.number;
}
    
function hasVotingPeriodExpired(uint256 _proposalIndex) public view returns (bool) {
        //This function checks for the voting period expiration for the proposal for 60 sec
        uint256 start = proposals[_proposalIndex].startingPeriod;
        return (now - start) >= 60;
    }

function hasVotingPeriodExpiredFinal(uint256 _proposalIndex) public view returns (bool) {
        //This function checks for the voting period expiration for the proposal for 60 sec
        uint256 start = proposals[_proposalIndex].startingPeriodFinal;
        return (now - start) >= 60;
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
        Vote vote = Vote(uintVote);

    
         require(proposals[proposalIndex].votesByMember[memberAddress] == Vote.Null, "submitVote - member has already voted on this proposal");
         require(vote == Vote.Yes || vote == Vote.No, "submitVote - vote must be either Yes or No");
        // store vote
         proposals[proposalIndex].votesByMember[memberAddress] = vote;
         proposals[proposalIndex].votedMembers.push(memberAddress);

    //    Adding counts to respective Yes or No
         if (vote == Vote.Yes) {
            proposals[proposalIndex].yesVotes  += 1;

         } else if (vote == Vote.No) {
            proposals[proposalIndex].noVotes += 1;
         }
         //ProposalFundBlock(proposalIndex,msg.sender);
         emit SubmitVote(proposalIndex, msg.sender, memberAddress, uintVote);
     }
     
    
    function proposerCompleteVote(uint256 p_Index,uint256 voteIndex)  public 
    {
        if (voteIndex==1) {
            proposals[p_Index].processed = true;
            proposals[p_Index].aborted = false;
            proposals[p_Index].startingPeriodFinal = now;
        }
        else
        {
            proposals[p_Index].aborted = true;
            proposals[p_Index].processed = false;   
            proposals[p_Index].startingPeriodFinal = now;
        }

    }
    

    function submitPassedVote(uint256 proposalIndex, uint8 uintVote) public {
        //This function 
         address memberAddress = msg.sender;
         Vote postVote = Vote(uintVote);

    //    Adding counts to respective Yes or No
         if (postVote == Vote.Yes) {
            proposals[proposalIndex].yesPostVotes  += 1;

         } 
         else if (postVote == Vote.No) {
            proposals[proposalIndex].noPostVotes += 1;
         }
         
         emit SubmitVote(proposalIndex, msg.sender, memberAddress, uintVote);
     }

     
    
   

    
}