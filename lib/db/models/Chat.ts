import mongoose, { Schema, models } from "mongoose";

export interface IConversation {
  userMessage: string;
  aiResponse: string;
  createdAt: Date;
}

export interface IChat {
  _id: string;
  userId: string;
  title: string;
  conversations: IConversation[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
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

const ChatSchema = new Schema<IChat>(
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
    conversations: [ConversationSchema],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by userId
ChatSchema.index({ userId: 1, createdAt: -1 });

const Chat = models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
