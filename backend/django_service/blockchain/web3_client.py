from web3 import Web3

class Web3Client:
    def __init__(self):
        # Hardcode or manage via settings
        self.rpc_url = 'http://127.0.0.1:8545' 
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        self.private_key = 'your_private_key_here'
        self.account = self.w3.eth.account.from_key(self.private_key) if self.private_key else None
        
    def is_connected(self):
        return self.w3.is_connected()

    def get_balance(self, address=None):
        if not address and self.account:
            address = self.account.address
        if not address:
            return 0
        balance = self.w3.eth.get_balance(address)
        return self.w3.from_wei(balance, 'ether')

    def send_transaction(self, contract_function, *args, **kwargs):
        if not self.account:
            raise Exception("Private key not provided")
            
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        
        tx = contract_function(*args, **kwargs).build_transaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 2000000,
            'gasPrice': self.w3.to_wei('50', 'gwei')
        })
        
        signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        
        return self.w3.to_hex(tx_hash)
