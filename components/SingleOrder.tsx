import React from "react";

interface OrderLineProps {
  cartItems: any;
  createdAt: string;
}

const SingleOrder = ({ cartItems, createdAt }: OrderLineProps) => {
  return (
    <div>
      <time>{createdAt}</time>
      {cartItems.map((item: any, i: string) => (
        <p key={i}>{item.price_data.product_data.name}</p>
      ))}
    </div>
  );
};

export default SingleOrder;
