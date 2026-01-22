import React from "react";

// Customer Care Page gives the information on how the company helps to its customers
const CustomerCarePage = () => {
    return (
        <div>
            <div style={{ padding: "15px 40px", borderBottom: "1px solid #ddd" }}>
                <strong>Customer Care</strong>
            </div>

            <div style={{ maxWidth: "1100px", margin: "50px auto", padding: "0 40px" }}>
                <h2>For us, “customer care” means standing shoulder to shoulder with you with an extensive network of technical experts worldwide, a comprehensive portfolio of products and services, in any situation, even when your AROL machines are operating at top capacity.</h2>

                <section
                    style={{
                        padding: "60px 40px",
                        maxWidth: "1100px",
                        margin: "0 auto"
                    }}>
                    <h1>SERVICE</h1>
                    <h3>AUDIT</h3>
                    <p>Inspection and survey of status of machines/lines, data collection and information necessary to define/schedule the works and/or new supplies</p>
                    <h3>FORMAT CHANGE</h3>
                    <p>Installation of machine or components, assistance during first production start-up</p>
                </section>

                <section style={{
                    background: "#f5f5f5",
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}>
                    <h1>SPARE PARTS</h1>
                    <h3>CENTRALIZED SPARE PARTS OFFER MANAGEMENT (1-3 DAYS AVERAGE RESPONSE TIME)</h3>
                    <p>Availability of customized spares</p>
                    <p>Red lane delivery on request</p>
                    <p>Over 15000 spares items ready</p>
                    <p>List of recommended spares for overhauling (after 3000/6000/12000/18000 hours) and first emergency kit/QMP</p>
                </section>

                <section style={{
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}>
                    <h1>TRAINING</h1>
                    <h3>
                        Training and updating in regards to the operation, maintenance and use of the machine
                    </h3>
                    <p>
                        Keeping pace with technological innovation means to constantly update our knowledge. This is why we at AROL have always invested in staff training.

                        For the same reason, we put our know-how at the disposal of our customers, offering training services aimed at training operators and technicians on the machines they use. We can train personnel at their own premises, at AROL or in-line.

                        With this innovative service, AROL intends to prove its willingness to assist customers step by step even after the machine has been sold, offering assistance for personnel and for machines.

                        The training service is held by experts and is specifically prepared on the customer’s needs, taking certain aspects into consideration, e.g. past experience of personnel to be trained, type of use and level of customisation of the machine on which personnel will subsequently work.
                    </p>
                </section>

                <section style={{
                    padding: "60px 40px",
                    maxWidth: "1100px",
                    margin: "0 auto",
                    background: "#f5f5f5",
                }}>
                    <h1>UPGRADES</h1>
                    <h3>IMPROVE YOUR EXISTING CAPPER’S CAPABILITIES WITH NEW COMPONENTS</h3>
                    <p>Analysis and quotation for caps application and movement</p>
                    <p>Reconditioning items</p>
                    <p>Optional equipment</p>
                    <p>Best solutions for new caps</p>
                </section>
            </div>
        </div>
    );
};

export default CustomerCarePage;
