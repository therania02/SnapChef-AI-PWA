import express from "express";
import midtransClient from "midtrans-client";
import jwt from "jsonwebtoken";
import { createRequire } from "module";
import { authMiddleware } from "../middleware/authMiddleware.js";

const require = createRequire(import.meta.url);
const db = require("../models/index.cjs");
const { User } = db;

const router = express.Router();

const resolveFrontendUrl = () => {
  const fallback = "http://localhost:5173";
  const raw = process.env.FRONTEND_URL || fallback;

  try {
    const parsed = new URL(raw);

    if (
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
      parsed.protocol === "https:"
    ) {
      parsed.protocol = "http:";
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
};

const buildUserData = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  scanLimit: user.scanLimit,
  lastScanDate: user.lastScanDate,
  premiumExpiresAt: user.premiumExpiresAt,
  isPremium:
    user.role === "premium" &&
    (!user.premiumExpiresAt || new Date(user.premiumExpiresAt) > new Date()),
});

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    console.log("MIDTRANS_SERVER_KEY =", process.env.MIDTRANS_SERVER_KEY);
    console.log("MIDTRANS_CLIENT_KEY =", process.env.MIDTRANS_CLIENT_KEY);
    console.log("MIDTRANS_IS_PRODUCTION =", process.env.MIDTRANS_IS_PRODUCTION);

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const orderId = `SC-${user.id}-${Date.now()}`;

    const frontendUrl = resolveFrontendUrl();

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: 49000,
      },
      item_details: [
        {
          id: "snapchef-premium-monthly",
          price: 49000,
          quantity: 1,
          name: "SnapChef AI Premium - 1 Bulan",
        },
      ],
      customer_details: {
        first_name: user.name || "SnapChef User",
        email: user.email,
      },
      callbacks: {
        finish: `${frontendUrl}/payment-success?order_id=${orderId}`,
        error: `${frontendUrl}/premium`,
        pending: `${frontendUrl}/premium`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return res.json({
      message: "Transaksi berhasil dibuat",
      order_id: orderId,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    return res.status(500).json({
      message: "Gagal membuat transaksi Midtrans",
      error: error.message,
    });
  }
});

router.get("/status/:orderId", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderParts = orderId.split("-");
    const orderUserId = orderParts[1];

    if (String(orderUserId) !== String(req.user.id)) {
      return res.status(403).json({
        message: "Order ini bukan milik user yang sedang login",
      });
    }

    const coreApi = new midtransClient.CoreApi({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const status = await coreApi.transaction.status(orderId);

    const transactionStatus = status.transaction_status;
    const fraudStatus = status.fraud_status;

    const isPaid =
      transactionStatus === "settlement" ||
      (transactionStatus === "capture" && fraudStatus === "accept");

    if (!isPaid) {
      return res.status(400).json({
        message: "Pembayaran belum berhasil",
        transaction_status: transactionStatus,
      });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const premiumExpiresAt = new Date();
    premiumExpiresAt.setDate(premiumExpiresAt.getDate() + 30);

    await user.update({
      role: "premium",
      premiumExpiresAt,
    });

    const updatedUser = await User.findByPk(req.user.id);
    const userData = buildUserData(updatedUser);

    const token = jwt.sign(
      userData,
      process.env.JWT_SECRET || "rahasia_snapchef_2026",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Pembayaran berhasil, premium aktif",
      user: userData,
      token,
      midtrans: status,
    });
  } catch (error) {
    console.error("Check payment status error:", error);

    return res.status(500).json({
      message: "Gagal mengecek status pembayaran",
      error: error.message,
    });
  }
});

export default router;