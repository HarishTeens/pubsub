/**
 *Submitted for verification at polygonscan.com on 2022-12-03
 */

// SPDX-License-Identifier: MIT
// File: @openzeppelin/contracts/utils/Context.sol

// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol

// OpenZeppelin Contracts (last updated v4.7.0) (access/Ownable.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: yugen.sol

pragma solidity ^0.8.0;

// PUSH Comm Contract Interface
interface IPUSHCommInterface {
    function sendNotification(
        address _channel,
        address _recipient,
        bytes calldata _identity
    ) external;
}

contract LockFunds is Ownable {
    uint256 public timeoutPeriod = 3 days;
    enum STATES {
        PENDING,
        CREATOR_ACK,
        SUBSCRIBER_ACK,
        COMPLETED,
        DISPUTED
    }
    struct service {
        address creator;
        uint256 amount; // in WEI
    }
    struct order {
        address creator;
        address receiver;
        uint256 amount; // in WEI
        uint256 createdAt;
        bool job;
        STATES state;
    }
    mapping(uint256 => service) public services;
    mapping(uint256 => order) public orders;

    mapping(address => uint256[]) public orderToReceive;
    mapping(address => uint256[]) public orderCreated;

    function createService(uint256 serviceId, uint256 amount) external {
        service storage item = services[serviceId];
        item.amount = amount;
        item.creator = msg.sender;
    }

    function lockFunds(uint256 orderId, uint256 serviceId) external payable {
        order storage item = orders[orderId];
        service storage sItem = services[serviceId];
        require(sItem.amount != 0, "Service not found");
        require(msg.value == sItem.amount, "Service amount is incorrect");
        require(item.createdAt == 0, "Order is already created");
        item.creator = msg.sender;
        item.receiver = sItem.creator;
        item.amount = sItem.amount;
        item.createdAt = block.timestamp;
        item.state = STATES.PENDING;
        orderCreated[msg.sender].push(orderId);
        orderToReceive[sItem.creator].push(orderId);

        IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa)
            .sendNotification(
                0x857cDF5Ea69eCBc50DD6E0618310655F0b69c87e, // from channel
                sItem.creator, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
                bytes(
                    string(
                        // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        abi.encodePacked(
                            "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                            "+", // segregator
                            "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                            "+", // segregator
                            "Order Placed", // this is notificaiton title
                            "+", // segregator
                            "Someone placed an order" // notification body
                        )
                    )
                )
            );
    }

    function claimCompleteJob(uint256 orderId) external {
        order storage item = orders[orderId];
        require(msg.sender == item.receiver, "You are not the receiver");
        require(item.state == STATES.PENDING, "Job not in pending state");
        item.state = STATES.CREATOR_ACK;
    }

    function completeJob(uint256 orderId) external onlyOwner {
        order storage item = orders[orderId];
        require(
            item.state == STATES.CREATOR_ACK,
            "Job not in appropriate state"
        );
        item.state = STATES.SUBSCRIBER_ACK;
        payable(item.receiver).transfer(item.amount);
        item.state = STATES.COMPLETED;
    }

    function raiseDispute(uint256 orderId) external {
        order storage item = orders[orderId];
        require(
            msg.sender == item.creator || msg.sender == item.receiver,
            "You are not authorized"
        );
        require(
            item.state != STATES.COMPLETED,
            "Order is already complete, cant raise a dispute now"
        );
        item.state = STATES.DISPUTED;
    }
    // function withdraw(uint256 orderId) external payable {
    //     order storage item = orders[orderId];
    //     require(item.state == STATES.PENDING, "Order is not live");
    //     require(item.job == false, "Job already done");
    //     require(item.creator == msg.sender, "You are not creator");
    //     require(item.createdAt + timeoutPeriod < block.timestamp, "Timeout not over yet");
    //     item.state = STATES.CANCELLED;
    //     payable(msg.sender).transfer(item.amount);
    // }

    // function ownerWithdraw(uint256 amount) external  onlyOwner {
    //     payable(msg.sender).transfer(amount);
    // }
}
