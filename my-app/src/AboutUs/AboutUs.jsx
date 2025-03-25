import React, { useState } from 'react';
import './AboutUs.css'; 
import teamMember1 from '../assets/images/aryan.jpg';
import teamMember2 from '../assets/images/fevin.jpg';
import teamMember3 from '../assets/images/kevin_ma.jpg';
import teamMember4 from '../assets/images/viraj.jpg';
import teamMember5 from '../assets/images/kevin_zhang.jpg';
import teamMember6 from '../assets/images/daniel_lee.jpg';
import teamMember7 from '../assets/images/adwaith.jpg';
import teamMember8 from '../assets/images/andi.jpg';
import teamMember9 from '../assets/images/glenda.jpg';
import teamMember10 from '../assets/images/terry.jpg';

const teamMembers = [
  { name: 'Aryan Roy', position: 'Project Manager', img: teamMember1, description: 'Placeholder description for Aryan.' },
  { name: 'Fevin Felix', position: 'Developer', img: teamMember2, description: 'Placeholder description for Fevin.' },
  { name: 'Kevin Ma', position: 'Developer', img: teamMember3, description: 'Placeholder description for Kevin.' },
  { name: 'Viraj Kulkarni', position: 'Developer', img: teamMember4, description: 'Placeholder description for Viraj.' },
  { name: 'Kevin Zhang', position: 'Developer', img: teamMember5, description: 'Placeholder description for Kevin Zhang.' },
  { name: 'Daniel Lee', position: 'Developer', img: teamMember6, description: 'Placeholder description for Daniel.' },
  { name: 'Adwaith Ramesh', position: 'Developer', img: teamMember7, description: 'Placeholder description for Adwaith.' },
  { name: 'Andi Xia', position: 'Developer', img: teamMember8, description: 'Placeholder description for Andi.' },
  { name: 'Glenda Setlock', position: 'UI Designer', img: teamMember9, description: 'Placeholder description for Glenda.' },
  { name: 'Terry Yin', position: 'Developer', img: teamMember10, description: 'Placeholder description for Terry.' },
];

function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const handleClose = () => {
    setSelectedMember(null);
  };

  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <section className="about-app">
        <h2>Our Mission</h2>
        <p>
          Welcome to <strong>GT Marketplace</strong>! Our mission is to provide a seamless marketplace experience, allowing users to buy and sell items efficiently and securely. GT Marketplace is a user-friendly website designed specifically for students and members of Georgia Tech. Our platform allows you to create listings, view available items, and buy or sell from each other with ease. We offer a seamless experience on our marketplace, where Georgia Tech students and affiliates can securely buy and sell items. GT Marketplace is a user-friendly site tailored for the Georgia Tech community. Whether you're looking for a textbook, a lab supply, or all the essentials to furnish your dorm, GT Marketplace can connect you with the items you need. We exist mainly to enable students and their affiliates to trade school supplies and other necessary items. Our webpage is easy to browse, and purchasing from or selling to your fellow students is a straightforward process. You can find everything without a hassle.
Our main purpose is to connect students so they can easily trade school supplies and other necessary items. By providing a simple and efficient way to browse listings, we aim to make the process of buying and selling as smooth as possible. You can find everything you need without the hassle of complicated processes.
        </p>
      </section>
      
      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li><strong>Sign Up/Login:</strong> Create an account or log in to access personalized features.</li>
          <li><strong>Browse Listings:</strong> Explore a wide range of products available for purchase.</li>
          <li><strong>Post Items for Sale:</strong> Easily list items you wish to sell with detailed descriptions and images.</li>
          <li><strong>Secure Transactions:</strong> Engage in secure transactions with our built-in payment systems.</li>
          <li><strong>Feedback System:</strong> Rate and review transactions to maintain a trustworthy community.</li>
        </ol>
      </section>


      <section className="team-section">
        <h2>Meet Our Team!</h2>
        <div className="team-container">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index} onClick={() => handleMemberClick(member)}>
              <img src={member.img} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.position}</p>
            </div>
          ))}
        </div>
      </section>


      {selectedMember && (
        <div className="overlay" onClick={handleClose}>
          <div className="selected-member" onClick={(e) => e.stopPropagation()}>
            <img src={selectedMember.img} alt={selectedMember.name} className="selected-member-image" />
            <h2>{selectedMember.name}</h2>
            <p>{selectedMember.description}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutUs;