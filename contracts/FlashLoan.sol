pragma solidity ^0.8.0;

import "./aave/FlashLoanReceiverBaseV2.sol";
import "../interfaces/v2/ILendingPoolAddressesProviderV2.sol";
import "../interfaces/v2/ILendingPoolV2.sol";
import 'hardhat/console.sol';

contract FlashLoan is FlashLoanReceiverBaseV2, Withdrawable {
    constructor(address _addressProvider)
        public
        FlashLoanReceiverBaseV2(_addressProvider)
    {}

/**
     * @dev This function must be called only be the LENDING_POOL and takes care of repaying
     * active debt positions, migrating collateral and incurring new V2 debt token debt.
     *
     * @param assets The array of flash loaned assets used to repay debts.
     * @param amounts The array of flash loaned asset amounts used to repay debts.
     * @param premiums The array of premiums incurred as additional debts.
     * @param initiator The address that initiated the flash loan, unused.
     * @param params The byte array containing, in this case, the arrays of aTokens and aTokenAmounts.
     */
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        //
        // This contract now has the funds requested.
        // Your logic goes here.
        //
        console.log("executing ops .. got money");

        uint256 contractBalance = address(this).balance;
        console.log(contractBalance);

        console.log("now sending money back");
        console.log(contractBalance);

        console.log(assets[0]);
                // console.log(contractBalance);

        console.log(amounts[0]);
        console.log(premiums[0]);

        // At the end of your logic above, this contract owes
        // the flashloaned amounts + premiums.
        // Therefore ensure your contract has enough to repay
        // these amounts.

        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i] + premiums[i];
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }
        console.log("sent money back");

        return true;
    }

    function aaveflashloan(address[] memory assets, uint256[] memory amounts)
        internal
    {
        address receiverAddress = address(this);

        address onBehalfOf = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        uint256[] memory modes = new uint256[](assets.length);

        // 0 = no debt (flash), 1 = stable, 2 = variable
        for (uint256 i = 0; i < assets.length; i++) {
            modes[i] = 0;
        }

        console.log("calling lending pool");

        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
        console.log("called lending pook");
    }

    /*
     *  Flash multiple assets
     */
    // function flashloan(address[] memory assets, uint256[] memory amounts)
    //     public
    //     onlyOwner
    // {
    //     _flashloan(assets, amounts);
    // }

    /*
     *  Flash loan 100000000000000000 wei (0.1 ether) worth of `_asset`
     */
    function flashloan(uint256 amount, address _asset) public {
        bytes memory data = "";

        console.log("asking for moneyy");
        console.log(amount);
        console.log(_asset);

        address[] memory assets = new address[](1);
        assets[0] = _asset;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        console.log("calling actual functions");
      aaveflashloan(assets, amounts);
    }

}