import { BlogCard } from "@/components/chat/ChatMessages";
import CustomError from "@/components/CustomError";
import { getBlog } from "@/lib/actions/blog.action";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getBlog(id);
  if ((data as any).__isError) {
    return <CustomError />;
  }
  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6">
      <BlogCard data={data} />
    </div>
  );
}
