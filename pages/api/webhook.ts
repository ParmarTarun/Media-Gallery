import { mongooseConnect } from "@/lib/mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { Order } from "@/models/order";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const endpointSecret =
  "whsec_361e0eaedbd4dc42b0cd72e71ef8d13ed4dc8ae679e385f2f1329478e77a8cf9";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  await mongooseConnect();
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === "paid";
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json("ok");
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
