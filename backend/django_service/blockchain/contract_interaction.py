import json
from .web3_client import Web3Client

class ContractInteraction:
    def __init__(self):
        self.client = Web3Client()
        self.contract_address = 'your_contract_address_here'
        # Load ABI from a JSON file if possible, or define a minimal one here
        self.abi = self._load_abi()
        
        if self.contract_address and self.abi:
            self.contract = self.client.w3.eth.contract(address=self.contract_address, abi=self.abi)
        else:
            self.contract = None

    def _load_abi(self):
        # Placeholder for ABI loading logic
        # In a real hardhat project, this would be in artifacts/contracts/KrishiPramaan.sol/KrishiPramaan.json
        try:
            with open('blockchain/abi.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Minimal ABI for a contract with a storeQualityHash(string passportId, string qualityHash) function
            return [
                {
                    "inputs": [
                        {"internalType": "string", "name": "passportId", "type": "string"},
                        {"internalType": "string", "name": "qualityHash", "type": "string"}
                    ],
                    "name": "recordQuality",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ]

    def record_quality_on_chain(self, passport_id, quality_hash):
        if not self.contract:
            print("Contract not initialized")
            return None
        
        try:
            tx_hash = self.client.send_transaction(self.contract.functions.recordQuality, passport_id, quality_hash)
            return tx_hash
        except Exception as e:
            print(f"Error recording quality on chain: {e}")
            return None
