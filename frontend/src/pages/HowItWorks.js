import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
  return (
    <div className="how-it-works">
      <header className="how-it-works-header">
        <h1>How It Works</h1>
        <p>Empowering startups and connecting innovators with supporters</p>
      </header>

      <section className="section">
        <h2>For Startups</h2>
        <p>
          Our platform is designed to help newly starting companies showcase their product ideas and prototypes.
          Normal people and donors can browse these ideas, and if they like a startup, they can donate to help bring it to life.
          If the startup launches successfully, donors receive the product as a reward for their support.
        </p>
      </section>

      <section className="section key-points">
        <h2>Key Points</h2>
        <div className="points-grid">
          <div className="point-card">
            <h3>No Money Until Goal Met</h3>
            <p>The startup owner receives no funds unless the required amount is obtained within the specified tenure.</p>
          </div>
          <div className="point-card">
            <h3>Minimum Donation</h3>
            <p>The minimum amount a person can donate is the cost of the product specified. They can also donate more to support the process.</p>
          </div>
          <div className="point-card">
            <h3>Legal Protection</h3>
            <p>If the startup owner runs away with the money, legal action will be taken against them.</p>
          </div>
          <div className="point-card">
            <h3>No Refunds on Failure</h3>
            <p>This is not a store. If the startup fails, the money will not be refunded.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>How We Make Money</h2>
        <div className="money-points">
          <div className="money-card">
            <h3>Advertisements</h3>
            <p>Startups can advertise their products to appear on the featured tab.</p>
          </div>
          <div className="money-card">
            <h3>Commission</h3>
            <p>For each donation, 20% is taken as commission by the company.</p>
          </div>
          <div className="money-card">
            <h3>Taxes Covered</h3>
            <p>Payment taxes are covered by the company's commission, so startups receive 80% of the donation.</p>
          </div>
          <div className="money-card">
            <h3>Grants</h3>
            <p>We receive grants from successful startups that launched through our platform.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;