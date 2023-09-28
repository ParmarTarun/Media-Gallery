import React from "react";

interface OrderLineProps {
  cartItems: any;
  createdAt: string;
}

const SingleOrder = ({ cartItems, createdAt }: OrderLineProps) => {
  return (
    <div>
      <time>{createdAt}</time>
      {cartItems.map((item: any) => (
        <p>{item.price_data.product_data.name}</p>
      ))}
    </div>
  );
};

export default SingleOrder;
