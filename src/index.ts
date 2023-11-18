require("dotenv").config();

import express, { Express, Request, Response } from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
// import multer, { FileFilterCallback } from 'multer';
// import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" }); // For my laptop

import employeeRoutes from "./routes/employeeRoute";
import customerRoutes from "./routes/customerRoute";
import assetFacilityRoutes from "./routes/assetFacilityRoute";
import speciesRoutes from "./routes/speciesRoute";
import animalRoutes from "./routes/animalRoute";
import promotionRoutes from "./routes/promotionRoute";
import announcementRoutes from "./routes/announcementRoute";
import customerOrderRoutes from "./routes/customerOrderRoute";
import listingRoutes from "./routes/listingRoute";
import listingCustomerRoutes from "./routes/listingCustomerRoute";
import zooEventRoutes from "./routes/zooEventRoute";
import orderItemRoutes from "./routes/orderItemRoute";
import enclosureRoutes from "./routes/enclosureRoute";
import zooEventCustomerRoutes from "./routes/zooEventCustomerRoute";
import itineraryRoutes from "./routes/itineraryRoute";
import { seedDatabase, createDatabase } from "./models/index";
import { conn } from "./db";

const truthy = ["TRUE", "true", "True", "1"];
const app = express();
app.use(
  cors({
    credentials: true,
  }),
);

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/img", express.static("img"));
app.use("/pdf", express.static("pdf"));
app.use("/enclosureDiagramJson", express.static("enclosureDiagramJson"));

const server = http.createServer(app);

const port = 3000;

server.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}/`);
  await conn.authenticate();
  console.log("Database connected!");

  if (truthy.includes(process.env.RESET_DB || "")) {
    await createDatabase({ forced: true });
    console.log("Database built!");
    await seedDatabase();
    console.log("Database seeded!");
  } else {
    await createDatabase({ forced: false });
    console.log("Database left untouched!");
  }
});

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("HELLO)s");
});

app.get("/config", (req: Request, res: Response) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/retrieve", async (req: Request, res: Response) => {
  const { id } = req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(id);

  if (paymentIntent) {
    res.send({ secret: paymentIntent.client_secret });
  } else {
    return res.status(400).json({ error: "error" });
  }
});

app.post("/create-payment-intent", async (req: Request, res: Response) => {
  const { total } = req.body;
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "sgd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      description: "transaction",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/fetchPayment", async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log(id);

  const paymentIntent = await stripe.paymentIntents.retrieve(id);
  console.log(paymentIntent);
  console.log(paymentIntent.payment_method_types);

  console.log(
    paymentIntent.payment_method_options.card.length == 0 ? "PAYNOW" : "CARD",
  );

  const paymentMethod = await stripe.paymentMethods.retrieve(
    paymentIntent.payment_method,
  );
  res.send({
    amount: paymentIntent.amount,
    type: paymentMethod.type.toUpperCase(),
    description: paymentIntent.description,
    status: paymentIntent.status,
    secret: paymentIntent.client_secret,
  });
});

app.use("/api/employee/", employeeRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/assetFacility", assetFacilityRoutes);
app.use("/api/species", speciesRoutes);
app.use("/api/animal", animalRoutes);
app.use("/api/promotion", promotionRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/customerOrder", customerOrderRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/listingCustomer", listingCustomerRoutes);
app.use("/api/zooEvent", zooEventRoutes);
app.use("/api/orderItem", orderItemRoutes);
app.use("/api/enclosure", enclosureRoutes);
app.use("/api/zooEventCustomer", zooEventCustomerRoutes);
app.use("/api/itinerary", itineraryRoutes);
