import React from 'react';

const HomePage = () => {
    return (
        <div>
            {/* Hero Section */}
            <div style={{ 
                backgroundColor: '#333', 
                color: 'white', 
                padding: '60px 40px', 
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))'
            }}>
                <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Capping Equipment World Leader</h1>
                <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
                    We design and manufacture capping machines, corking machines, and cap handling systems for any kind of closure.
                </p>
                <button style={{ marginTop: '30px', padding: '12px 25px', fontSize: '1em', backgroundColor: '#d32f2f', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Discover Our Solutions
                </button>
            </div>

            {/* Features Section */}
            <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#d32f2f' }}>Global Presence</h3>
                    <p>With 740 specialists in 4 production plants and 11 operative branches worldwide.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#d32f2f' }}>Custom Engineering</h3>
                    <p>Tailor-made solutions designed to meet the specific requirements of your production line.</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: '#d32f2f' }}>Reliability</h3>
                    <p>Over 40 years of experience ensuring the highest safety and efficiency standards.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;