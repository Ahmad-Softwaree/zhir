import mongoose, { Schema, models } from "mongoose";

export interface IBlogConversation {
  userMessage: string;
  aiResponse: string;
  createdAt: Date;
}

export interface IBlog {
  _id: string;
  userId: string;
  title: string;
  conversation: IBlogConversation;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const BlogConversationSchema = new Schema<IBlogConversation>({
  userMessage: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const BlogSchema = new Schema<IBlog>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    conversation: {
      type: BlogConversationSchema,
      required: true,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ userId: 1, createdAt: -1 });

const Blog = models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
