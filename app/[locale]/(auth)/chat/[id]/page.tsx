import ChatMessages from "@/components/chat/ChatMessages";
import { getChat } from "@/lib/actions/chat.server.action";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getChat(id);
  return (
    <div className="flex-1 overflow-y-auto p-6 ">
      <ChatMessages data={data} />
    </div>
  );
}
