import React from 'react';
import Swal from 'sweetalert2';
import '../css/Contact.css';

export default function Contact() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", "ead85fc0-efc8-425f-ad62-6c50624a93c8");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Message Received",
        text: "Thank You!",
        icon: "success",
        customClass: {
          confirmButton: 'swal2-confirm'
        }
      });
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <section className="contact-section">

      <div className="contact-intro">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-description">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <form className="contact-form" onSubmit={onSubmit}>
        <div className="form-group-container">
          <div className="form-group">
            <label for="name" className="form-label">Name</label>
            <input id="name" name="name" className="form-input" placeholder="Your name" type="text" />
          </div>
          <div className="form-group">
            <label for="email" className="form-label">Email</label>
            <input id="email" name="email" className="form-input" placeholder="Your email" type="email" required/>
          </div>
          <div className="form-group">
            <label for="phone" className="form-label">Phone</label>
            <input id="phone" name="phone" className="form-input" placeholder="Your number" type="text" />
          </div>
          <div className="form-group">
            <label for="message" className="form-label">Message</label>
            <textarea className="form-textarea" id="message" name="message" placeholder="Your message" required></textarea>
          </div>
        </div>
        <button className="form-submit" type="submit">Send Message</button>
      </form>
      <span>{result}</span>

  </section>
  );
}