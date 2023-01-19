import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x1BD57B24a7B2d74c48aaaf48DeEDa4CbDFe20955";
  const contractABI = abi.abi
  console.log("currentAccount: ", currentAccount);

  const checkIfWalletIsConnected = async () => {

    //window.ethereumにアクセスできることを確認する
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      //ユーザーのウォレットへのアクセスが許可されているかどうか確認
      const accounts = await ethereum.request({method: "eth_accounts"});
      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      }else {
        console.log("No authorized account found");
      }
    }catch(error){
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        alert("Get Metamask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      })
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    }catch (error) {
      console.log(error);
    }
  };

  //waveの回数をカウントする関数
  const wave = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContrace = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContrace.getTotalWaves();
        console.log("Signer:",signer);
        //コントラクトにwaveを書き込む
        const waveTxn = await wavePortalContrace.wave();
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);
        count = await wavePortalContrace.getTotalWaves();
        console.log("Retrived total wave count...", count.toNumber());
      } else{
        console.log("Ethereum object doesn't exist!");
      }
    }catch(error){
      console.log(error);
    }
  };

  //ページがロードされたときに実行される関数
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">👋</span> WELCOME!
        </div>

        <div className="bio">
          イーサリアムウォレットを接続して、メッセージを作成したら、<span role="img" aria-label="hand-wave">👋</span>を送ってください<span role="img" aria-label="shine">✨</span>
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Wallet Connected
          </button>
        )}
      </div>
    </div>
  );
};
