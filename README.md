# Objective

- We have 2 EOA accounts, 0xmain and 0xspecific.
- All the assets (ETH and ERC20s) transferred from 0xspecific are bridged to Polygon chain by 0xmain.
- If any other address sends any asset to 0xmain, it is transferred to 0xspecific.

# How it's done?

- The main function of the script is executed in recursive intervals of 5mins using node cron-job. This cron-job is kept running in an EC2 instance of AWS.
- Main steps:
    I. ETH payBacks: Get information of ETH amounts that were received in last 5 mins from other addresses (except 0xspecific)
        i. Only amounts greater than 0.0002 ETH are included in payBacks.
        ii. Before sending amounts to 0xspecific, gas fees are deducted to maintain 0xmain ETH balance. 
    II. ERC20 payBacks: Get information of ERC20 amounts that were received in last 5 mins from other addresses (except 0xspecific)
        i. Check current ETH balance for 0xmain
        ii. Execute ERC20 transfer only if ETH balance > 0.0005
        This is done to avoid transaction failing (leading to script crashing) during cron-job.
    III. Bridging ERC20: Bridge all ERC20s contained (in 0xmain) to Polygon
        i. Check current ETH balance for 0xmain
        ii. Execute ERC20 bridging only if ETH balance > 0.0005
        This is done to avoid transaction failing (leading to script crashing) during cron-job.
    IV. Bridging ETH: Bridge all ETH above minimum balance amount
        i. Check current ETH balance for 0xmain
        ii. Execute ETH bridging only if ETH balance > minimumBalance (where minimumBalance = 0.005 ETH)

# About Code

- To interact with Polygon PoS bridge we need PoSClient. In posClient.js this is configured
- The config.js contains all information used in the main scripts, like rpc, token addresses, user addresses, private key, etc
- helper.js contain all major logics:
    