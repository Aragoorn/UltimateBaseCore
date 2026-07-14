let account;
// ⚠️ آدرس قرارداد دپلو شده این پروژه را دقیقاً اینجا جایگزین کنید
const contractAddress = "0x3F68F6ad2d86d5151eC4f51aE82f2C674bDb8Fa0"; 

const connectBtn = document.getElementById("connectBtn");
const walletAddressP = document.getElementById("walletAddress");
const stakedBalanceH3 = document.getElementById("stakedBalance");
const sbtStatusSpan = document.getElementById("sbtStatus");
const txStatusP = document.getElementById("txStatus");

const getProvider = () => window.ethereum || (window.rabby ? window.rabby : null);

async function connectWallet() {
    const provider = getProvider();
    if (provider) {
        try {
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            walletAddressP.innerText = `Connected: ${account.substring(0,6)}...${account.substring(38)}`;
            connectBtn.innerText = "Wallet Connected";
            txStatusP.innerText = "";
            await updateDashboard();
        } catch (error) {
            txStatusP.innerText = "Connection rejected.";
        }
    } else {
        alert("Please unlock Rabby and refresh!");
    }
}

async function updateDashboard() {
    const provider = getProvider();
    if (!account || !provider) return;
    try {
        const cleanAddress = account.toLowerCase().replace("0x", "").padStart(64, '0');
        
        // ۱. بررسی وضعیت استیک کاربر از Mapping قرارداد (تابع stakes)
        const stakesData = "0x7c9bbd8b" + cleanAddress; 
        const stakeResponse = await provider.request({
            method: 'eth_call',
            params: [{ to: contractAddress, data: stakesData }, 'latest']
        });
        // مقدار بازگشتی ساختار شامل ۲ متغیر ۳۲ بایتی است که ۳۲ بایت اول میزان अमाउंट است
        const rawAmount = stakeResponse.substring(0, 66);
        const weiBalance = BigInt(rawAmount);
        const ethBalance = Number(weiBalance) / 1e18;
        stakedBalanceH3.innerText = `${ethBalance.toFixed(6)}`;

        // ۲. بررسی وضعیت擁有یت SBT از Mapping قرارداد (تابع isSBT)
        const sbtData = "0xb6edbc7b" + cleanAddress; 
        const sbtResponse = await provider.request({
            method: 'eth_call',
            params: [{ to: contractAddress, data: sbtData }, 'latest']
        });
        const hasSBT = BigInt(sbtResponse) === 1n;
        if(hasSBT) {
            sbtStatusSpan.innerText = "SBT Active";
            sbtStatusSpan.className = "badge";
        } else {
            sbtStatusSpan.innerText = "No SBT";
            sbtStatusSpan.className = "badge badge-none";
        }

    } catch (error) {
        console.error("Failed to fetch dashboard info:", error);
    }
}

// تابع واریز و استیک توکن (Deposit)
document.getElementById("stakeBtn").addEventListener("click", async () => {
    const provider = getProvider();
    const amount = document.getElementById("stakeAmount").value;
    if (!amount || !account || !provider) { alert("Connect wallet and enter amount in Wei"); return; }
    
    // تبدیل مقدار وارد شده به فرمت هگزادسیمال متناسب با uint256
    const hexAmount = BigInt(amount).toString(16).padStart(64, '0');
    const data = "0xb6b55f25" + hexAmount; // هش متد deposit(uint256)

    try {
        txStatusP.innerText = "Sending stake transaction...";
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: account, to: contractAddress, data: data, value: '0x0' }],
        });
        txStatusP.innerText = `Stake Sent! Hash: ${txHash.substring(0,15)}...`;
        setTimeout(updateDashboard, 5000);
    } catch (error) {
        txStatusP.innerText = "Stake failed. Ensure you have standard ERC20 allowance if testing transfers.";
    }
});

// تابع مینت کردن مدال یا پاسپورت دیجیتال (mintSBT)
document.getElementById("mintSbtBtn").addEventListener("click", async () => {
    const provider = getProvider();
    if (!account || !provider) { alert("Please connect wallet first"); return; }
    
    const data = "0x899a80e6"; // هش متد mintSBT()

    try {
        txStatusP.innerText = "Requesting your Soulbound Token Mint...";
        const txHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [{ from: account, to: contractAddress, data: data, value: '0x0' }],
        });
        txStatusP.innerText = `SBT Minted! Hash: ${txHash.substring(0,15)}...`;
        setTimeout(updateDashboard, 5000);
    } catch (error) {
        txStatusP.innerText = "SBT Minting failed.";
    }
});

connectBtn.addEventListener("click", connectWallet);