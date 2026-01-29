import mongoose, { Schema, models } from "mongoose";

export interface IPaymentHistory {
  _id: string;
  userId: mongoose.Types.ObjectId;
  stripePaymentId: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const PaymentHistorySchema = new Schema<IPaymentHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stripePaymentId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentHistory =
  models.PaymentHistory ||
  mongoose.model<IPaymentHistory>("PaymentHistory", PaymentHistorySchema);

export default PaymentHistory;
