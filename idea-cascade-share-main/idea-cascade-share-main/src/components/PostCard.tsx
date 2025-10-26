import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Image as ImageIcon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  link_url: string | null;
  category: string | null;
  visibility: string;
  created_at: string;
}

interface PostCardProps {
  post: Post;
  onUpdate: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
            <Badge
              variant={
                post.visibility === "public"
                  ? "default"
                  : post.visibility === "friends"
                  ? "outline"
                  : "secondary"
              }
            >
              {post.visibility}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {post.content && (
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
        )}
        {post.image_url && (
          <div className="relative rounded-lg overflow-hidden border">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}
        {post.link_url && (
          <a
            href={post.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            {post.link_url}
          </a>
        )}
      </CardContent>
    </Card>
  );
}
