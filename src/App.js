import { useState } from "react";
import Web3 from "web3";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #e8e8e8;
`;

const Dialog = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConnectButton = styled.button`
  all: unset;
  color: white;
  border-radius: 10px;
  font-size: 32px;
  padding: 20px 30px;
  background-color: #004ccf;
  &:hover {
    background-color: #033ea3;
  }
`;

const NavContainer = styled.div`
  padding-block: 30px;
`;

const TopBar = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  margin-inline: auto;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
`;

const Add = styled.div`
  overflow: hidden;
  margin-right: 15px;
  text-overflow: ellipsis;
`;

const Balace = styled.div`
  white-space: nowrap;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background-color: white;
  max-width: 500px;
  margin-inline: auto;
  padding: 20px;
  border-radius: 10px;
`;

const Label = styled.label`
  margin-bottom: 8px;
`;

const Input = styled.input`
  all: unset;
  border: 1px solid #7a7a7a;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  all: unset;
  font-size: 20px;
  height: 45px;
  border-radius: 5px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 100%;
  background-color: #0184ff;
`;

const Link = styled.a`
  all: unset;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [tranferSuccess, setTranferSuccess] = useState({
    status: false,
    Tx: "",
  });
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const connectWallectHandler = async () => {
    const web3 = new Web3(window.xdc);
    const state = web3.currentProvider.publicConfigStore._state;
    setAddress(state.selectedAddress);
    await web3.eth.getBalance(state.selectedAddress, (err, res) => {
      if (err) console.log(err);
      else {
        setBalance(truncBal(res));
        setWalletConnected(true);
      }
    });
  };

  const truncBal = (bal) => {
    let balance = bal;
    balance = bal / Math.pow(10, 18);
    return balance.toFixed(3);
  };

  const sentHandler = (e) => {
    e.preventDefault();
    const web3 = new Web3(window.xdc);
    web3.eth.sendTransaction(
      {
        from: address,
        gasPrice: "10000000000000",
        gasLimit: "1000000000000",
        to: toAddress,
        value: amount,
        data: "",
      },
      (err, transactionHash) => {
        if (err) console.log(err);
        else setTranferSuccess({ status: true, Tx: transactionHash });
      }
    );
  };
  const amountHandler = (xdcAmount) => {
    const newAmount = xdcAmount * Math.pow(10, 18);
    setAmount(newAmount);
  };

  const sendAddHandler = (add) => {
    const newToAdd = add.replace(/xdc/, "0x");
    setToAddress(newToAdd);
  };

  return (
    <Container>
      {!walletConnected ? (
        <Dialog>
          <ConnectButton onClick={connectWallectHandler}>
            Connect Wallet
          </ConnectButton>
        </Dialog>
      ) : (
        <NavContainer>
          <TopBar>
            <Add>{address?.replace(/0x/, "xdc")}</Add>
            <Balace>XDC: {balance}</Balace>
          </TopBar>
        </NavContainer>
      )}
      <>
        <FormContainer onSubmit={sentHandler}>
          {!tranferSuccess.status ? (
            <>
              <Label>Recipient Address</Label>
              <Input
                type="text"
                onChange={(e) => sendAddHandler(e.target.value)}
                required
              />
              <Label>Amount</Label>
              <Input
                type="text"
                onChange={(e) => amountHandler(e.target.value)}
                required
              />
              <Button type="submit">Send</Button>
            </>
          ) : (
            <Link
              href={`https://explorer.apothem.network/tx/${tranferSuccess.Tx}`}
            >
              Successfully Tranfered {tranferSuccess.Tx}
            </Link>
          )}
        </FormContainer>
      </>
    </Container>
  );
}

export default App;
