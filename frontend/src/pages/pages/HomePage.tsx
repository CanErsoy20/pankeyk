import React, { useState } from "react";

const HomePage = () => {
    const [popupOpen, setPopupOpen] = useState(false);

    return (
        <div>
            {/* HERO */}
            <div
                style={{
                    backgroundColor: "#333",
                    color: "white",
                    padding: "70px 40px",
                    textAlign: "center"
                }}
            >
                <h1 style={{ fontSize: "3em", marginBottom: "20px" }}>
                    CUSTOMISED CAPPING MACHINES FOR ANY CLOSURE NEED
                </h1>

                <p style={{ fontSize: "1.2em", maxWidth: "900px", margin: "0 auto" }}>
                    700+ capping machines delivered every year and 25.000+ installed all over the world in a vast variety of industries, from 1.000 to 100.000 bph,
                    make of arol the largest specialist of customized solutions to any capping need.
                </p>

                <button
                    onClick={() => setPopupOpen(true)}
                    style={{
                        marginTop: "30px",
                        padding: "12px 25px",
                        backgroundColor: "#d32f2f",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    Discover Our Solutions
                </button>
            </div>

            {/* COMPANY OVERVIEW */}
            <section
                style={{
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto",
                    background: "#f5f5f5"
                }}
            >
                <h2>CUSTOMISED CAPPING MACHINES FOR ANY CLOSURE NEED</h2>
                <p style={{ lineHeight: "1.7" }}>
                    700+ capping machines delivered every year and 25.000+ installed all over the world in a vast variety of industries, from 1.000 to 100.000 bph,
                    make of arol the largest specialist of customized solutions to any capping need.
                </p>
            </section>

            {/* SECTORS */}
            <section
                style={{
                    padding: "60px 40px"
                }}
            >
                <h2 style={{ textAlign: "center" }}>FIND THE CAPPING MACHINES FOR YOUR PRODUCT</h2>

                <div
                    style={{
                        marginTop: "40px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "30px",
                        maxWidth: "1100px",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    <div style={{ background: "white", padding: "20px" }}>
                        Beverage
                    </div>
                    <div style={{ background: "white", padding: "20px" }}>
                        Beer
                    </div>
                    <div style={{ background: "white", padding: "20px" }}>
                        Water
                    </div>
                    <div style={{ background: "white", padding: "20px" }}>
                        Juice
                    </div>
                </div>
            </section>

            {/* NUMBERS & FACTS */}
            <section
                style={{
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto",
                    background: "#f5f5f5"
                }}
            >
                <h2>Key Numbers</h2>
                <ul style={{ lineHeight: "2" }}>
                    <li>Years of experience</li>
                    <li>Installations worldwide</li>
                    <li>Countries served</li>
                    <li>Employees</li>
                </ul>
            </section>

            {/* TECHNOLOGY */}
            <section
                style={{
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >
                <h2>Innovation & Technology</h2>
                <p>Innovation and technology are at the core of our engineering approach. Continuous research and development activities allow us to design advanced solutions that combine precision, reliability, and efficiency. Our multidisciplinary teams work closely across mechanical, electronic, and software engineering to develop systems that meet the highest industrial standards.</p>
                <p>Through constant testing, prototyping, and optimization, we ensure that every solution delivers long-term performance, operational safety, and adaptability to different production environments. This technological expertise enables us to support customers with solutions that evolve alongside market and industry requirements.</p>
            </section>

            {/* WORLDWIDE PRESENCE */}
            <section
                style={{
                    background: "#f5f5f5",
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >
                <h2>Worldwide Presence</h2>
                <p>
                    Our worldwide presence allows us to operate close to our customers, providing timely support and localized expertise across global markets. With production facilities, subsidiaries, and commercial offices in multiple countries, we are able to respond efficiently to regional needs while maintaining consistent quality standards.

                    This international network ensures reliable service, technical assistance, and after-sales support wherever our solutions are installed. By combining global coordination with local presence, we build long-term partnerships and deliver value across diverse industrial sectors worldwide.
                </p>
            </section>

            {/* NEWS & EVENTS */}
            <section
                style={{
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >
                <h2>News & Events</h2>
                <div style={{ background: "white", padding: "20px" }}>
                    Beer&Food Attraction
                </div>
                <div style={{ background: "white", padding: "20px" }}>
                    CFIA
                </div>
                <div style={{ background: "white", padding: "20px" }}>
                    Interpack
                </div>

            </section>

            {/* CUSTOMER CARE CTA */}
            <section
                style={{
                    background: "#333",
                    color: "white",
                    padding: "50px",
                    textAlign: "center"
                }}
            >
                <h2>Customer Care</h2>
                <p>
                    Our customer care services ensure continuous support after installation, combining technical assistance, maintenance, and spare parts availability to guarantee long-term reliability and optimal performance of our solutions.
                </p>
            </section>

            {/* POPUP */}
            {popupOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <div style={{ background: "white", padding: "30px" }}>
                        <p>Read the rest!</p>
                        <button onClick={() => setPopupOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
