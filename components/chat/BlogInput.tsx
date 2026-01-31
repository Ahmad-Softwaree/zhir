"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { generateBlog } from "@/lib/actions/blog.action";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { handleMutationError } from "@/lib/error-handler";
import { useRouter } from "@/i18n/navigation";

const BlogInput = () => {
  const t = useTranslations("blog.input");
  const blog_t = useTranslations("blog.errors");
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    setIsLoading(true);

    try {
      let result = await generateBlog({
        title: title.trim(),
        description: description.trim(),
      });
      if (result && !("__isError" in result)) {
        toast.success("Blog generated successfully!");
        return router.push(`/ai/blog/chat/${result.id}`);
      }
      throw result;
    } catch (error) {
      handleMutationError(error, t, blog_t("generateBlogFailed"), (msg) => {
        toast.error(msg);
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 border-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            {t("titleLabel")}
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("titlePlaceholder")}
            disabled={isLoading}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            {t("descriptionLabel")}
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("descriptionPlaceholder")}
            disabled={isLoading}
            rows={4}
            className="text-base resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || !title.trim() || !description.trim()}
          className="w-full gap-2"
          size="lg">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("generating")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              {t("generateButton")}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default BlogInput;
