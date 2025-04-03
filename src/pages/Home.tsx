import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { APP_NAME, DATA } from "../app-data";
import * as AppGeneral from "../components/socialcalc/index.js";
import { useEffect, useState } from "react";
import { Local } from "../components/Storage/LocalStorage";
import { menu, settings, wallet, alert } from "ionicons/icons";
import { useSDK } from "@metamask/sdk-react";
import "./Home.css";
import Menu from "../components/Menu/Menu";
import Files from "../components/Files/Files";
import NewFile from "../components/NewFile/NewFile";

const SUPPORTED_NETWORKS = {
  CALIBRATION: {
    chainId: "0x4cb2f",
    chainName: "Filecoin Calibration",
    rpcUrls: ["https://api.calibration.node.glif.io/rpc/v1"],
    nativeCurrency: {
      name: "tFIL",
      symbol: "tFIL",
      decimals: 18,
    },
    blockExplorerUrls: ["https://calibration.filfox.info/en"]
  },
  LINEA_SEPOLIA: {
    chainId: "0xe705",
    chainName: "Linea Sepolia",
    rpcUrls: ["https://rpc.sepolia.linea.build"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.lineascan.build"]
  },
  BASE_SEPOLIA: {
    chainId: "0x14a34",
    chainName: "Base Sepolia",
    rpcUrls: ["https://sepolia.base.org"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.basescan.org"]
  },
  OPTIMISM_SEPOLIA: {
    chainId: "0xaa37dc",
    chainName: "Optimism Sepolia",
    rpcUrls: ["https://sepolia.optimism.io"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia-optimism.etherscan.io"]
  },
  OPTIMISM: {
    chainId: "0xa",
    chainName: "Optimism",
    rpcUrls: ["https://rpc.ankr.com/optimism"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://optimistic.etherscan.io/"]
  },
  FILECOIN : {
    chainId: "0x13a",
    chainName: "Filecoin Mainnet",
    rpcUrls: ["https://api.node.glif.io"],
    nativeCurrency: {
      name: "FIL",
      symbol: "FIL",
      decimals: 18,
    },
    blockExplorerUrls: ["https://filfox.info/"]
  },
  POLYGON_AMOY: {
    chainId: "0x13882",
    chainName: "Polygon Amoy",
    rpcUrls: ["https://rpc-amoy.polygon.technology"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://www.oklink.com/amoy"]
  },
  CELO_ALFAJORES: {
    chainId: "0xaef3",
    chainName: "Celo Alfajores",
    rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
    nativeCurrency: {
      name: "CELO",
      symbol: "CELO",
      decimals: 18,
    },
    blockExplorerUrls: ["https://alfajores.celoscan.io"]
  }
};

const Home: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showPopover, setShowPopover] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({ open: false, event: undefined });
  const [showDisconnect, setShowDisconnect] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({ open: false, event: undefined });
  const [selectedFile, updateSelectedFile] = useState("default");
  const [billType, updateBillType] = useState(1);
  const [device] = useState("default");
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const store = new Local();

  const closeMenu = () => {
    setShowMenu(false);
  };

  const activateFooter = (footer) => {
    AppGeneral.activateFooterButton(footer);
  };

  const setNetwork = async () => {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [chainId],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  useEffect(() => {
    const data = DATA["home"][device]["msc"];
    AppGeneral.initializeApp(JSON.stringify(data));
  }, []);

  useEffect(() => {
    const storedAccount = localStorage.getItem("connectedAccount");
    if (storedAccount) {
      setAccount(storedAccount); // Set the retrieved account
    }
  }, []);

  useEffect(() => {
    activateFooter(billType);
  }, [billType]);

  useEffect(() => {
    const switchToFilecoin = async () => {
      if (!provider) return;
      
      try {
        // Try to switch to Filecoin network
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SUPPORTED_NETWORKS.FILECOIN.chainId }],
        });
      } catch (switchError: any) {
        // This error code means the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [SUPPORTED_NETWORKS.FILECOIN],
            });
          } catch (addError) {
            console.error("Failed to add Filecoin network:", addError);
          }
        }
        console.error("Failed to switch to Filecoin network:", switchError);
      }
    };

    if (connected && provider) {
      switchToFilecoin();
    }
  }, [provider, connected]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      const account = accounts?.[0];
      setAccount(account);
      if (account) {
        localStorage.setItem("connectedAccount", account);
      }
      setNetwork();
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

  const disconnect = async () => {
    try {
      await sdk?.disconnect();
      setAccount(undefined);
      localStorage.removeItem("connectedAccount"); // Clear the stored account
    } catch (err) {
      console.warn("failed to disconnect..", err);
    }
  };

  const footers = DATA["home"][device]["footers"];
  const footersList = footers.map((footerArray) => {
    return (
      <IonButton
        key={footerArray.index}
        expand="full"
        color="light"
        className="ion-no-margin"
        onClick={() => {
          updateBillType(footerArray.index);
          activateFooter(footerArray.index);
          setShowPopover({ open: false, event: undefined });
        }}
      >
        {footerArray.name}
      </IonButton>
    );
  });

  // Helper function to check if current network is supported
  const getCurrentNetwork = (chainId: string | undefined) => {
    if (!chainId) return null;
    return Object.values(SUPPORTED_NETWORKS).find(
      network => network.chainId.toLowerCase() === chainId.toLowerCase()
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{APP_NAME}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar color="primary">
          <IonIcon
            icon={settings}
            slot="end"
            className="ion-padding-end"
            size="large"
            onClick={(e) => {
              setShowPopover({ open: true, event: e.nativeEvent });
              console.log("Popover clicked");
            }}
          />
          <Files
            store={store}
            file={selectedFile}
            updateSelectedFile={updateSelectedFile}
            updateBillType={updateBillType}
          />

          <NewFile
            file={selectedFile}
            updateSelectedFile={updateSelectedFile}
            store={store}
            billType={billType}
          />

          {connected && !getCurrentNetwork(chainId) && (
            <IonButton
              className="custom-switch-button"
              slot="end"
              onClick={() => setNetwork()}
              color="warning"
            >
              <IonIcon icon={alert} size="small" />
              Switch to supported network
            </IonButton>
          )}

          <IonButton
            className="custom-connect-button"
            slot="end"
            style={{ padding: 2 }}
            onClick={(e) => {
              if (connected) {
                setShowDisconnect({ open: true, event: e.nativeEvent });
              } else {
                connect();
              }
            }}
            color="dark"
            disabled={connecting}
          >
            <IonIcon icon={wallet} style={{ paddingRight: "6px" }} />
            {connecting
              ? "Connecting..."
              : connected && account
              ? `${account?.slice(0, 6)}...${account?.slice(-6)}`
              : "Connect Wallet"}
          </IonButton>
          {connected && account && (
            <IonPopover
              animated
              keyboardClose
              backdropDismiss
              event={showDisconnect.event}
              isOpen={showDisconnect.open}
              onDidDismiss={() =>
                setShowDisconnect({ open: false, event: undefined })
              }
              side="bottom"
              alignment="center"
              className="custom-popover"
            >
              <IonButton onClick={disconnect} className="custom-popover-button">
                Disconnect Wallet
              </IonButton>
            </IonPopover>
          )}
          <IonPopover
            animated
            keyboardClose
            backdropDismiss
            event={showPopover.event}
            isOpen={showPopover.open}
            onDidDismiss={() =>
              setShowPopover({ open: false, event: undefined })
            }
          >
            {footersList}
          </IonPopover>
        </IonToolbar>
        <IonToolbar color="secondary">
          <IonTitle className="ion-text-center">
            Editing : {selectedFile}
          </IonTitle>
        </IonToolbar>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton type="button" onClick={() => setShowMenu(true)}>
            <IonIcon icon={menu} />
          </IonFabButton>
        </IonFab>

        <Menu
          showM={showMenu}
          setM={closeMenu}
          file={selectedFile}
          updateSelectedFile={updateSelectedFile}
          store={store}
          bT={billType}
        />

        <div id="container">
          <div id="workbookControl"></div>
          <div id="tableeditor"></div>
          <div id="msg"></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
