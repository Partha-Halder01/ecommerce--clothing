"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Upload, Loader2, X, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { blogsAPI, getCurrentUser, authAPI, Blog, getAuthToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function AdminBlogs() {
    const router = useRouter()
    const { toast } = useToast()
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        content: "",
        image_url: "",
        author: "Admin",
        is_published: true
    })
    const [isUploading, setIsUploading] = useState(false)
    const imageRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const user = getCurrentUser()
        if (!user || !user.is_admin) {
            router.push("/admin/login")
            return
        }
        fetchBlogs()
    }, [router])

    const fetchBlogs = async () => {
        try {
            const data = await blogsAPI.adminGetAll()
            setBlogs(data)
        } catch (error: any) {
            if (error.message?.includes("401")) {
                authAPI.logout()
                router.push("/admin/login")
            } else {
                toast({ title: "Error", description: "Failed to load blogs", variant: "destructive" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const uploadImage = async (file: File): Promise<string | null> => {
        const fd = new FormData()
        fd.append('file', file)
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${getAuthToken()}` },
                body: fd
            })
            if (!response.ok) throw new Error('Upload failed')
            const result = await response.json()
            return result.url
        } catch {
            toast({ title: "Upload failed", variant: "destructive" })
            return null
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        const url = await uploadImage(file)
        if (url) {
            setFormData(prev => ({ ...prev, image_url: url }))
        }
        setIsUploading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingBlog) {
                await blogsAPI.update(editingBlog.id, formData)
                toast({ title: "Success", description: "Blog post updated" })
            } else {
                await blogsAPI.create(formData)
                toast({ title: "Success", description: "Blog post created" })
            }
            setIsDialogOpen(false)
            setEditingBlog(null)
            setFormData({
                title: "",
                summary: "",
                content: "",
                image_url: "",
                author: "Admin",
                is_published: true
            })
            fetchBlogs()
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to save blog post", variant: "destructive" })
        }
    }

    const handleEdit = (blog: Blog) => {
        setEditingBlog(blog)
        setFormData({
            title: blog.title,
            summary: blog.summary || "",
            content: blog.content,
            image_url: blog.image_url || "",
            author: blog.author || "Admin",
            is_published: blog.is_published
        })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return
        try {
            await blogsAPI.delete(id)
            toast({ title: "Success", description: "Blog post deleted" })
            fetchBlogs()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const handleTogglePublished = async (blog: Blog) => {
        try {
            await blogsAPI.update(blog.id, { is_published: !blog.is_published })
            toast({ title: "Success", description: `Blog ${blog.is_published ? 'moved to Drafts' : 'published successfully'}` })
            fetchBlogs()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    if (isLoading) return <div className="p-8 flex items-center justify-center min-h-screen"><p>Loading blogs...</p></div>

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Blogs</h1>
                    <p className="text-muted-foreground">Manage and upload articles for your boutique site</p>
                </div>
                <Button onClick={() => {
                    setFormData({ title: "", summary: "", content: "", image_url: "", author: "Admin", is_published: true });
                    setEditingBlog(null);
                    setIsDialogOpen(true)
                }} className="bg-[#D4AF37] hover:bg-[#B49027] text-black font-semibold">
                    <Plus className="h-4 w-4 mr-2" /> Write Article
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <Card key={blog.id} className={`flex flex-col h-full overflow-hidden border border-[#E8E3DC] shadow-sm relative ${!blog.is_published ? "bg-[#FCFBF8]/80 border-dashed" : "bg-white"}`}>
                        <div className="relative h-48 w-full bg-[#F4F1EB]">
                            {blog.image_url ? (
                                <Image src={blog.image_url} alt={blog.title} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <FileText className="h-12 w-12 opacity-30" />
                                </div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${blog.is_published ? "bg-green-600 text-white" : "bg-gray-400 text-white"}`}>
                                    {blog.is_published ? "Published" : "Draft"}
                                </span>
                            </div>
                        </div>
                        <CardHeader className="p-5 pb-2">
                            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-1 font-semibold">{blog.author} · {new Date(blog.created_at).toLocaleDateString()}</p>
                            <CardTitle className="text-lg font-normal text-[#1C1615] line-clamp-2" style={{ fontFamily: "var(--font-playfair)" }}>{blog.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-6 font-light">{blog.summary || "No summary provided"}</p>
                            
                            <div className="flex items-center justify-between border-t border-[#E8E3DC] pt-4 mt-auto">
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleTogglePublished(blog)} title={blog.is_published ? "Demote to draft" : "Publish now"}>
                                        {blog.is_published ? <ToggleRight className="h-5 w-5 text-[#D4AF37]" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(blog)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <a href={`/blogs/${blog.slug}`} target="_blank" rel="noreferrer">
                                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold uppercase tracking-wider border-[#E8E3DC] hover:bg-[#F4F1EB] rounded-none">
                                        <Eye className="h-3 w-3 mr-1" /> View
                                    </Button>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {blogs.length === 0 && (
                    <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-[#E8E3DC] bg-white rounded-lg">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-light">No articles written yet</p>
                        <p className="text-sm font-light opacity-60 mt-1">Create your first blog post by clicking the "Write Article" button</p>
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-light text-[#1C1615]" style={{ fontFamily: "var(--font-playfair)" }}>
                            {editingBlog ? "Edit Article" : "Write New Article"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase tracking-wider text-[#6B635E] font-medium mb-1 block">Article Title *</label>
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter a compelling title" required className="border-[#E8E3DC] rounded-none" />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-wider text-[#6B635E] font-medium mb-1 block">Author</label>
                                <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Author name" className="border-[#E8E3DC] rounded-none" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wider text-[#6B635E] font-medium mb-1 block">Summary / Intro *</label>
                            <Textarea value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                placeholder="Write a short summary (1-2 sentences) to show in previews" rows={2} required className="border-[#E8E3DC] rounded-none" />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wider text-[#6B635E] font-medium mb-1 block">Content (HTML or plain text) *</label>
                            <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write the main body of your article. You can use HTML styling tags if desired." rows={10} required className="border-[#E8E3DC] rounded-none font-sans" />
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wider text-[#6B635E] font-medium mb-1 block">Featured Image</label>
                            <div className="flex gap-3 items-center">
                                <input type="file" ref={imageRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                                <Button type="button" variant="outline" size="sm" onClick={() => imageRef.current?.click()} disabled={isUploading} className="border-[#E8E3DC] hover:bg-[#F4F1EB] rounded-none">
                                    {isUploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />} Upload Image
                                </Button>
                                <Input placeholder="Or paste full image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="flex-1 border-[#E8E3DC] rounded-none" />
                            </div>
                            {formData.image_url && (
                                <div className="mt-3 relative inline-block border border-[#E8E3DC] p-1 bg-white">
                                    <Image src={formData.image_url} alt="Preview" width={160} height={100} className="object-cover" />
                                    <button type="button" onClick={() => setFormData({ ...formData, image_url: "" })} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 py-2">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={formData.is_published}
                                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                className="h-4 w-4 accent-[#D4AF37]"
                            />
                            <label htmlFor="is_published" className="text-sm font-medium text-[#1C1615] select-none cursor-pointer">Publish immediately</label>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 border-t border-[#E8E3DC] pt-4 mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#E8E3DC] rounded-none">Cancel</Button>
                            <Button type="submit" className="bg-[#D4AF37] hover:bg-[#B49027] text-black font-semibold rounded-none">{editingBlog ? "Save Changes" : "Publish Article"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
