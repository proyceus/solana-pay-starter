import React, { useState, useMemo } from "react";
import { Keypair, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { InfinitySpin } from "react-loader-spinner";
import IPFSDownload from "./IpfsDownload";

const Buy = ({ itemID }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const orderID = useMemo(() => Keypair.generate().publicKey, []);

  const [paid, setPaid] = useState(null);
  const [loading, setLoading] = useState(false);

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderID: orderID.toString(),
      itemID: itemID,
    }),
    [publicKey, orderID, itemID]
  );

  const processTransaction = async () => {
    setLoading(true);
    const txResponse = await fetch("../api/createTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const txData = await txResponse.json();

    const tx = Transaction.from(Buffer.from(txData.transaction, "base64"));
    console.log("Tx data is", tx);

    try {
      const txHash = await sendTransaction(tx, connection);
      console.log(
        `Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`
      );
      setPaid(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div>
        <p>You need to connect your wallet to make transactions</p>
      </div>
    );
  }

  if (loading) {
    return <InfinitySpin color="gray" />;
  }

  return (
    <div>
      {paid ? (
        <IPFSDownload
          filename="mafiapack.zip"
          hash="QmdgkZfev6Ugru2Jsr9N9EAL3dpVL4PNSgpRGA8x54SQ1K"
          cta="Download mafia pack"
        />
      ) : (
        <button
          disabled={loading}
          className="buy-button"
          onClick={processTransaction}
        >
          Buy now
        </button>
      )}
    </div>
  );
};

export default Buy;
