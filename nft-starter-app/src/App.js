import './styles/App.css';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import TestNFT from './utils/TestNFT.json';

// update contact address + abi json everytime you deploy
const CONTRACT_ADDRESS = "0xaED3640d3d06db27646e380cFF53A06610f0EC17";

const App = () => {
	// init state vars
	const [currentUserAccount, setCurrentUserAccount] = useState("");
	const [loadState, setLoadState] = useState(false);

	// Render Methods
	const renderNotConnectedContainer = () => (
		<button onClick={connectWallet} className="cta-button connect-wallet-button">Connect to Wallet</button>
	);
	const renderMintUI = () => {
		return <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">Mint NFT</button>
	}

	const checkWalletConnection = async () => {
		const { ethereum } = window;

		if(!ethereum) {
			console.log('pls dl metamask');
			return;
		} else {
			console.log('have ethereum', ethereum);
		}

		// check if authorised to access user wallet
		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if(accounts.length !== 0) {
			const account = accounts[0];
			console.log('authorised account found', account);

			setCurrentUserAccount(account);

			setupEventListener();
		} else {
			console.log('no account found');
		}
	}

	// get user wallet
	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if(!ethereum) {
				alert('get metamask');
				return;
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

			console.log('connected', accounts[0]);
			setCurrentUserAccount(accounts[0]);

			setupEventListener();
		} catch (err) {
			console.log(err);
		}
	}

	// setup event listener
	const setupEventListener = async () => {
		try {
			const { ethereum } = window;

			if(ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, TestNFT.abi, signer);

				// "capture" the event when our contract throws it
				// similar to webhooks
				connectedContract.on("NewTestNFTMinted", (from, tokenID) => {
					console.log(from, tokenID.toNumber());

					alert(`NFT is minted and sent to wallet. it might be blank rn, and itll take a while to show up. heres the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenID.toNumber()}`)
				});

				console.log('event listener is set up');
			} else {
				console.log('ethereum object doesnt exist');
			}
		} catch(error) {
			console.log(error);
		}
	}

	// mint nft
	const askContractToMintNFT = async () => {
		try {
			const { ethereum } = window;

			if(ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, TestNFT.abi, signer);

				console.log('poppin\' that wallet to pay for gas');
				let nftTxn = await connectedContract.makeTestNFT();

				console.log('Mining... please wait');
				await nftTxn.wait();

				console.log(`Mined successfully, see: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
			} else {
				console.log('ethereum object doesnt exist');
			}
		} catch(error) {
			console.log(error);
		}
	}

	useEffect(() => {
		checkWalletConnection();
	}, []);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<p className="header gradient-text">My NFT Collection</p>
					<p className="sub-text">
						{currentUserAccount === '' ? 'Please connect a wallet' : 'Welcome user!'}
					</p>

					{currentUserAccount === '' ? renderNotConnectedContainer() : renderMintUI()}
				</div>
			</div>
		</div>
	);
};

export default App;
