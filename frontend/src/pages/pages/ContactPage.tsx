import React, {useState} from "react";

// Contact Page gives the information of Physical location and a notification sender
// Notification sender is a placeholder, only to test button and popup functionality
const ContactPage = () => {
    const [popupOpen, setPopupOpen] = useState(false);
    return (
        <div>
            <div style={{ padding: "15px 40px", borderBottom: "1px solid #ddd" }}>
                <strong>Contact</strong>
            </div>

            <div style={{ maxWidth: "1100px", margin: "50px auto", padding: "0 40px" }}>
                <h1>Contacts</h1>

                <section
                    style={{
                        background: "#f5f5f5",
                        padding: "60px 40px",
                        maxWidth: "1100px",
                        margin: "0 auto"
                    }}>
                    <h3>Headquarters</h3>
                    <p>Corso Duca degli Abruzzi, 24 · 011 090102</p>
                </section>

                <section
                    style={{
                        padding: "60px 40px",
                        maxWidth: "1100px",
                        margin: "0 auto"
                    }}>
                    <h3>Contact Details</h3>
                    <p>INFO:  info@systemAndDevice.com</p>
                    <p>SALES:  sales@systemAndDevice.com</p>
                    <p>CUSTOMER CARE: spares@systemAndDevice.com</p>
                </section>

                <section
                    style={{
                        background: "#f5f5f5",
                        padding: "60px 40px",
                        maxWidth: "1100px",
                        margin: "0 auto"
                    }}>
                    <h3>Contact Form</h3>
                    <p>Do you need more information and to get in touch with our experts?</p>
                    <p>Simply fill out the contact form.</p>
                    <p>Our team will get back to you as soon as possible.</p>

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
                        Send us a message
                    </button>
                </section>
            </div>
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
                        <p>Send us a notification!</p>
                        <button onClick={() => setPopupOpen(false)}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
