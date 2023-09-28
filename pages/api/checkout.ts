import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/order";
import { Product, productSchemaType } from "@/models/product";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method !== "POST") {
    res.json("Should be a post request!");
    return;
  }

  await mongooseConnect();

  const { name, email, city, postalCode, streetAdd, cartProductIds } = req.body;

  const productIds: ObjectId[] = cartProductIds;
  const uniqueIds = Array.from(new Set(productIds));
  const productDocs = await Product.find({ _id: uniqueIds });

  const cartItems = [];

  for (const pId of uniqueIds) {
    const productDetails: productSchemaType = productDocs.find(
      (prod) => prod._id.toString() === pId
    );

    const quantity = productIds.filter((id) => id === pId).length || 0;
    if (quantity > 0 && productDetails) {
      cartItems.push({
        quantity,
        price_data: {
          currency: "USD",
          product_data: { name: productDetails.title },
          unit_amount: productDetails.price * 100,
        },
      });
    }
  }

  const session = await getServerSession(req, res, authOptions);

  const orderDoc = await Order.create({
    userEmail: session?.user?.email,
    cartItems,
    name,
    email,
    city,
    postalCode,
    streetAdd,
    paid: false,
  });

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: cartItems,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=1",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=1",
    metadata: { orderId: orderDoc._id.toString() },
  });

  res.json({ url: stripeSession.url });
};

export default handler;
