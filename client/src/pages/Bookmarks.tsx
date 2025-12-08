import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Bookmarks() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState("default");

  const { data: bookmarks = [], isLoading, refetch } = trpc.bookmarks.list.useQuery();
  const createMutation = trpc.bookmarks.create.useMutation();
  const deleteMutation = trpc.bookmarks.delete.useMutation();

  const handleCreate = async () => {
    if (!title.trim() || !url.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title,
        url,
        folder,
      });
      toast.success("Bookmark created successfully");
      setTitle("");
      setUrl("");
      setFolder("default");
      setIsOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create bookmark");
    }
  };

  const handleDelete = async (bookmarkId: number) => {
    try {
      await deleteMutation.mutateAsync({ bookmarkId });
      toast.success("Bookmark deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete bookmark");
    }
  };

  // Group bookmarks by folder
  const groupedBookmarks = bookmarks.reduce(
    (acc, bookmark) => {
      const folderName = bookmark.folder || "default";
      if (!acc[folderName]) {
        acc[folderName] = [];
      }
      acc[folderName].push(bookmark);
      return acc;
    },
    {} as Record<string, typeof bookmarks>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Bookmarks
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Save and organize your favorite websites
          </p>
        </div>

        {/* Create Bookmark Button */}
        <div className="mb-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">Add a New Bookmark</DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400">
                  Save a website for quick access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., GitHub"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="url" className="text-slate-700 dark:text-slate-300">
                    URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="folder" className="text-slate-700 dark:text-slate-300">
                    Folder
                  </Label>
                  <Input
                    id="folder"
                    placeholder="default"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Bookmark"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bookmarks by Folder */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : Object.keys(groupedBookmarks).length === 0 ? (
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">No bookmarks yet. Add your first bookmark!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBookmarks).map(([folderName, folderBookmarks]) => (
              <div key={folderName}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 capitalize">
                  {folderName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folderBookmarks.map((bookmark) => (
                    <Card
                      key={bookmark.id}
                      className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-slate-900 dark:text-white text-lg break-words">
                            {bookmark.title}
                          </CardTitle>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(bookmark.id)}
                            disabled={deleteMutation.isPending}
                            className="border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all flex items-center gap-2"
                        >
                          {bookmark.url}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
