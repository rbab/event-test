import React, { useState } from "react";

const OfferForm = ({ onCreateOffer }) => {
  const [offerName, setOfferName] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerEmail, setOfferEmail] = useState("");
  const [price, setPrice] = useState(0);

  const handleOfferNameChange = (e) => {
    setOfferName(e.target.value);
  };

  const handleOfferDescriptionChange = (e) => {
    setOfferDescription(e.target.value);
  };

  const handleOfferEmailChange = (e) => {
    setOfferEmail(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleCreateOffer = () => {
    onCreateOffer({
      offer_name: offerName,
      offer_description: offerDescription,
      offer_email: offerEmail,
      price: price,
    });
    setOfferName("");
    setOfferDescription("");
    setOfferEmail("");
    setPrice(0);
  };

    //   TODO: Add styling
  return (
    <div>
      <h2>Create Offer</h2>
      <input
        type="text"
        placeholder="Offer Name"
        value={offerName}
        onChange={handleOfferNameChange}
      />
      <input
        type="text"
        placeholder="Offer Description"
        value={offerDescription}
        onChange={handleOfferDescriptionChange}
      />
      <input
        type="text"
        placeholder="Offer Email"
        value={offerEmail}
        onChange={handleOfferEmailChange}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={handlePriceChange}
      />
      <button onClick={handleCreateOffer}>Create Offer</button>
    </div>
  );
};

export default OfferForm;
