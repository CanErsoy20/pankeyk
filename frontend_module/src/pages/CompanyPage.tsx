// import React, { useState } from 'react';
//
// const CompanyPage = () => {
//     const [open, setOpen] = useState(false);
//
//     return (
//         <div>
//             {/* Dropdown Menu */}
//             <div style={{ padding: '15px 40px', borderBottom: '1px solid #ddd' }}>
//                 <div style={{ position: 'relative', display: 'inline-block' }}>
//                     <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//                         Menu ▾
//                     </button>
//                     <div style={{ position: 'absolute', background: 'white', border: '1px solid #ddd' }}>
//                         <div style={{ padding: '10px' }}>Home</div>
//                         <div style={{ padding: '10px' }}>Company</div>
//                         <div style={{ padding: '10px' }}>Contact</div>
//                     </div>
//                 </div>
//             </div>
//
//             <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
//                 <h1 style={{ borderBottom: '3px solid #d32f2f', paddingBottom: '10px', display: 'inline-block' }}>
//                     About Us
//                 </h1>
//
//                 <div style={{ marginTop: '30px', display: 'flex', gap: '40px' }}>
//                     <div style={{ flex: 2 }}>
//                         <h3>Our History</h3>
//                         <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
//                             Founded in the heart of the packaging valley, our company has grown to become a point of reference for the global market.
//                             Since 1978, we have focused on a single goal: designing the best closing systems in the world.
//                         </p>
//                         <p style={{ lineHeight: '1.6' }}>
//                             Our passion for technology and innovation drives us to constantly improve our standards, offering our customers
//                             state-of-the-art solutions that guarantee protection and safety for their products.
//                         </p>
//                     </div>
//
//                     <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', border: '1px solid #ddd' }}>
//                         <h4 style={{ marginTop: 0 }}>Quick Facts</h4>
//                         <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
//                             <li>Founded: 1978</li>
//                             <li>Headquarters: Canelli, Italy</li>
//                             <li>Exports: 85% of production</li>
//                             <li>Patents: Over 100 registered</li>
//                         </ul>
//                     </div>
//                 </div>
//
//                 <div style={{ marginTop: '50px', backgroundColor: '#e9ecef', padding: '30px', textAlign: 'center' }}>
//                     <h2>Get in Touch</h2>
//                     <p>Do you have a project in mind? Contact our sales team today.</p>
//                     <button
//                         onClick={() => setOpen(true)}
//                         style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
//                     >
//                         Contact Us
//                     </button>
//                 </div>
//             </div>
//
//             {/* Popup */}
//             {open && (
//                 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <div style={{ background: 'white', padding: '30px' }}>
//                         <p>Please contact our sales team.</p>
//                         <button onClick={() => setOpen(false)}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default CompanyPage;
