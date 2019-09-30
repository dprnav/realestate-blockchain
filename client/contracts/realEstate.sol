pragma solidity ^0.4.17;

contract realEstate{

    address public admin;

    mapping(string => propertyDetails) properties;
    mapping(address => AgreementDraft[])myPropertiesDeed;

    function realEstate() public{
        admin = msg.sender;
    }

    struct propertyDetails{
        address owner;
        uint deedIndex;
        uint totalOwners;
    }
    struct AgreementDraft {
        string propertyAddress;   //confirm the size of uniqueid
        uint amountPaid;
        uint register_timestamp;
        address prev_owner;
        address new_owner;
        string digitalAgreement;   // confirm size of IPFS
        Status agreementStatus;
    }

    enum Status{
        active,
        inactive
    }

    function addProperty(string propertyAddress,
        string digitalAgreement) public onlyAdmin {

        require(properties[propertyAddress].owner==0);
        properties[propertyAddress].owner = admin;
        myPropertiesDeed[admin].push(AgreementDraft({

            propertyAddress: propertyAddress,
            amountPaid: uint(0),
            register_timestamp: now,
            prev_owner: address(0),
            new_owner: admin,
            digitalAgreement: digitalAgreement,
            agreementStatus: Status.active
        }));

        properties[propertyAddress].deedIndex = myPropertiesDeed[admin].length-1;
        properties[propertyAddress].totalOwners = 1;
    }


    function deedTransfer(string propertyAddress, uint amount, string digitalAgreement, address new_owner) private{

        require(properties[propertyAddress].owner!=0);

        propertyDetails storage temp = properties[propertyAddress];
        AgreementDraft storage tempAD = myPropertiesDeed[temp.owner][temp.deedIndex];

        myPropertiesDeed[new_owner].push(AgreementDraft({

            propertyAddress: propertyAddress,
            amountPaid: amount,
            register_timestamp: now,
            prev_owner: temp.owner,
            new_owner: new_owner,
            digitalAgreement: digitalAgreement,
            agreementStatus: Status.active
        }));

        tempAD.agreementStatus = Status.inactive;
        temp.owner = new_owner;
        temp.totalOwners++;
    }

    function buyProperty(string propertyAddress, string digitalAgreement, uint amount) public payable{

        require(properties[propertyAddress].owner!=0 && properties[propertyAddress].owner!=msg.sender && amount != uint(0) && amount == msg.value);

        properties[propertyAddress].owner.transfer(amount);

        //Deed Transfer
        propertyDetails storage temp = properties[propertyAddress];
        AgreementDraft storage tempAD = myPropertiesDeed[temp.owner][temp.deedIndex];

        myPropertiesDeed[msg.sender].push(AgreementDraft({

            propertyAddress: propertyAddress,
            amountPaid: amount,
            register_timestamp: now,
            prev_owner: temp.owner,
            new_owner: msg.sender,
            digitalAgreement: digitalAgreement,
            agreementStatus: Status.active
        }));

        tempAD.agreementStatus = Status.inactive;
        temp.owner = msg.sender;
        temp.totalOwners++;
    }


    function getDeed(string propertyAddress) public view returns(string){
        return myPropertiesDeed[msg.sender][properties[propertyAddress].deedIndex].digitalAgreement;
    }

    function getOwner(string propertyAddress) public view returns(address){
        return properties[propertyAddress].owner;
    }

    function propertyHistory(string propertyAddress) public view returns(address[]){
        address[] memory history = new address[](properties[propertyAddress].totalOwners);
        address temp = properties[propertyAddress].owner;

        for(uint j=0;j<history.length;j++){
            history[j] = temp;
            AgreementDraft[] memory x = myPropertiesDeed[temp];
            for(uint i=0;i<myPropertiesDeed[temp].length;i++){
                if(keccak256(x[i].propertyAddress) == keccak256(propertyAddress)){
                    temp = myPropertiesDeed[temp][i].prev_owner;
                    break;
                }
            }
        }
        return history;
    }

    function getAgreement(address owner, string propertyAddress) public view returns(uint,uint,string){

        AgreementDraft[] memory x = myPropertiesDeed[owner];
        for(uint i=0;i<myPropertiesDeed[owner].length;i++){
                if(keccak256(x[i].propertyAddress) == keccak256(propertyAddress)){
                    return (x[i].amountPaid/1000000000000000000,x[i].register_timestamp,x[i].digitalAgreement);
                }
            }
    }

    modifier onlyAdmin{
        require(msg.sender == admin);
        _;
    }

}
