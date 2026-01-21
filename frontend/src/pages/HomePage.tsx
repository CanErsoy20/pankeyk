import React, { useState } from 'react';

const HomePage = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <div>
            {/* Dropdown Menu */}
            <div style={{ padding: '15px 40px', borderBottom: '1px solid #ddd' }}>
                <div
                    style={{ position: 'relative', display: 'inline-block' }}
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                >
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        Menu ▾
                    </button>

                    {menuOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                background: 'white',
                                border: '1px solid #ddd',
                                minWidth: '150px',
                                zIndex: 10
                            }}
                        >
                            <div style={{ padding: '10px' }}>Home</div>
                            <div style={{ padding: '10px' }}>Company</div>
                            <div style={{ padding: '10px' }}>Contact</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hero Section */}
            <div style={{
                backgroundColor: '#333',
                color: 'white',
                padding: '60px 40px',
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))'
            }}>
                <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>
                    Capping Equipment World Leader
                </h1>
                <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: '0 auto' }}>
                    We design and manufacture capping machines, corking machines, and cap handling systems for any kind of closure.
                </p>
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        marginTop: '30px',
                        padding: '12px 25px',
                        fontSize: '1em',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
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

            {/* Popup */}
            {open && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '30px' }}>
                        <p>More information about our solutions.</p>
                        <button onClick={() => setOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;