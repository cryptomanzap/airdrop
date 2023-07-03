import React from 'react';
import { useEffect, useState } from 'react';
import logo from './logo.png';
import banner from './banner.png';
import './App.css';
import abi from './contracts';
import { ethers } from 'ethers';
import { Button, Divider, Avatar, Container, Card, CardHeader, CardMedia, CardContent, CardActions, Typography, CssBaseline,  } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GetAppIcon from '@mui/icons-material/GetApp';


// You token contract address
const contractAddress = "0xA553CEB5338647a27dA49f1E21d951543FF948dc";

// the fee in wei, fee = 1000000000000000 means 0.001 BNB
const fee = 2200000000000000;


function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if(!ethereum){
      console.log("Metamask NOT Installed");
      return;
    }else{
      console.log("Metamask Installed");
    }
   }

  const connectWalletHandler = async() => { 
    const { ethereum } = window;
    if(!ethereum){
      alert("Please Install Metamask!");
    }

    try{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log("Found an account :", accounts[0]);
      setCurrentAccount(accounts[0]);
    }catch (err){
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <Button onClick={connectWalletHandler} variant="contained" startIcon={<AccountBalanceWalletIcon />}>
        Wallet Connect
      </Button>
    )
  }

  const airdropButton = () => {
    return (
      <Button onClick={airdropHandler} variant="contained" startIcon={<GetAppIcon />}>
        Claim Airdrop
      </Button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  
  const airdropHandler = async() => {
    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Intialize payment");
        let getadrp = await contract.dropTokens({value: fee});
        console.log(contract);
		if(getadrp){
			alert("Congratulations, you got our airdrop, you will receive your tokens very soon");
		}else{
			alert("Something wrong, Maybe you don't have enough BNB balance for transaction fee or your wallet already have this token");
		}
      }
    }catch(err){
		alert("Something wrong, Maybe you don't have enough BNB balance for transaction fee or your wallet already have this token");
    	console.log(err);
    }

  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">

    <Card sx={{ maxWidth: 750, bgcolor: '#fafafa' }}>
      <CardHeader
      avatar={
        <Avatar src={logo} sx={{ width: 90, height: 90 }}/>
      }
        titleTypographyProps={{variant:'h5' }}
        title="MiD (Cloud Mining Doge)Coin Airdrop"
        style={{backgroundColor: "#e0e0e0"}}
      />
      <CardMedia
        component="img"
        height="200"
        image={banner}
        alt=""
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" p={2}>
        You can use MiD coin stake in app.dodoex.io/earn/mining and recive DOGE Rewards. 
        </Typography>
        <Typography variant="h7" color="text.secondary" p={2}>
          Contract : 0x8F010086326018ae1Ef531ACbbdF57E34c92155d
        </Typography>
        <Typography variant="h6" color="text.secondary" p={2}>
          Claim : 10 (MiD) COIN
        </Typography>
      </CardContent>
      <Divider />
      <CardActions style={{justifyContent: 'center'}}>
          {currentAccount ? airdropButton() : connectWalletButton()}
      </CardActions>

    </Card>

    </Container>
    </React.Fragment>
  );
}

export default App;
