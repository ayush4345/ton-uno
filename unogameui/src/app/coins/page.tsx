import React from 'react';

const coins = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC' },
    { id: 2, name: 'Ethereum', symbol: 'ETH' },
    { id: 3, name: 'Ripple', symbol: 'XRP' },
    { id: 4, name: 'Litecoin', symbol: 'LTC' },
    { id: 5, name: 'Cardano', symbol: 'ADA' },
];

const CoinList: React.FC = () => {
    return (
        <div>
            <h1>Coin List</h1>
            <ul>
                {coins.map(coin => (
                    <li key={coin.id}>
                        {coin.name} ({coin.symbol})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoinList;