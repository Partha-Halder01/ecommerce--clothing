"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, ChevronRight, FolderPlus, Upload, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categoriesAPI, getCurrentUser, authAPI, Category, getAuthToken } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface ExtendedCategory extends Category {
    image_url?: string
}

export default function AdminCategories() {
    const router = useRouter()
    const { toast } = useToast()
    const [categories, setCategories] = useState<ExtendedCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<ExtendedCategory | null>(null)
    const [formData, setFormData] = useState({ name: "", description: "", parent_id: null as number | null, image_url: "" })
    const [isUploading, setIsUploading] = useState(false)
    const imageRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const user = getCurrentUser()
        if (!user || !user.is_admin) { router.push("/login"); return }
        fetchCategories()
    }, [router])

    const fetchCategories = async () => {
        try {
            const data = await categoriesAPI.adminGetAll()
            setCategories(data as ExtendedCategory[])
        } catch (error: any) {
            if (error.message?.includes("401")) { authAPI.logout(); router.push("/login") }
            else toast({ title: "Error", description: "Failed to load categories", variant: "destructive" })
        } finally { setIsLoading(false) }
    }

    const uploadImage = async (file: File): Promise<string | null> => {
        const fd = new FormData()
        fd.append('file', file)
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
                method: 'POST', headers: { 'Authorization': `Bearer ${getAuthToken()}` }, body: fd
            })
            if (!response.ok) throw new Error('Upload failed')
            return (await response.json()).url
        } catch { toast({ title: "Upload failed", variant: "destructive" }); return null }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        const url = await uploadImage(file)
        if (url) setFormData(prev => ({ ...prev, image_url: url }))
        setIsUploading(false)
    }

    const parentCategories = categories.filter(c => !c.parent_id)
    const getSubcategories = (parentId: number) => categories.filter(c => c.parent_id === parentId)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory.id, formData)
                toast({ title: "Success", description: "Category updated" })
            } else {
                await categoriesAPI.create(formData)
                toast({ title: "Success", description: formData.parent_id ? "Subcategory created" : "Category created" })
            }
            setIsDialogOpen(false)
            setEditingCategory(null)
            setFormData({ name: "", description: "", parent_id: null, image_url: "" })
            fetchCategories()
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to save category", variant: "destructive" })
        }
    }

    const handleEdit = (category: ExtendedCategory) => {
        setEditingCategory(category)
        setFormData({ name: category.name, description: category.description || "", parent_id: category.parent_id || null, image_url: category.image_url || "" })
        setIsDialogOpen(true)
    }

    const handleAddSubcategory = (parentId: number) => {
        setEditingCategory(null)
        setFormData({ name: "", description: "", parent_id: parentId, image_url: "" })
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        const subcats = getSubcategories(id)
        if (subcats.length > 0) {
            if (!confirm(`This will delete the category and its ${subcats.length} subcategories. Continue?`)) return
        } else {
            if (!confirm("Delete this category?")) return
        }
        try {
            await categoriesAPI.delete(id)
            toast({ title: "Success", description: "Category deleted" })
            fetchCategories()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    const handleToggleActive = async (category: ExtendedCategory) => {
        try {
            await categoriesAPI.update(category.id, { is_active: !category.is_active })
            toast({ title: "Success", description: `Category ${category.is_active ? 'disabled' : 'enabled'}` })
            fetchCategories()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }

    if (isLoading) return <div className="p-8 flex items-center justify-center min-h-screen"><p>Loading...</p></div>

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Categories</h1>
                    <p className="text-muted-foreground">Manage product categories and subcategories</p>
                </div>
                <Button onClick={() => { setFormData({ name: "", description: "", parent_id: null, image_url: "" }); setEditingCategory(null); setIsDialogOpen(true) }}>
                    <Plus className="h-4 w-4 mr-2" /> Add Category
                </Button>
            </div>

            <div className="space-y-4">
                {parentCategories.map((category) => {
                    const subcats = getSubcategories(category.id)
                    return (
                        <Card key={category.id} className={!category.is_active ? "opacity-60" : ""}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {category.image_url && (
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                <Image src={category.image_url} alt={category.name} width={48} height={48} className="object-cover w-full h-full" />
                                            </div>
                                        )}
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {category.name}
                                            {subcats.length > 0 && (
                                                <span className="text-xs text-muted-foreground font-normal">
                                                    ({subcats.length} subcategories)
                                                </span>
                                            )}
                                        </CardTitle>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${category.is_active ? "bg-green-100 text-green-800" : "bg-[#F4F1EB] text-[#6B635E]"}`}>
                                        {category.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">{category.description || "No description"}</p>

                                {subcats.length > 0 && (
                                    <div className="mb-4 pl-4 border-l-2 border-muted space-y-2">
                                        {subcats.map(sub => (
                                            <div key={sub.id} className={`flex items-center justify-between p-2 rounded-lg bg-muted/50 ${!sub.is_active ? 'opacity-60' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{sub.name}</span>
                                                    <span className={`px-1.5 py-0.5 text-[10px] rounded ${sub.is_active ? "bg-green-100 text-green-700" : "bg-[#F4F1EB] text-[#6B635E]"}`}>
                                                        {sub.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggleActive(sub)}>
                                                        {sub.is_active ? <ToggleRight className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(sub)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600" onClick={() => handleDelete(sub.id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleAddSubcategory(category.id)}>
                                        <FolderPlus className="h-4 w-4 mr-1" /> Add Subcategory
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleToggleActive(category)}>
                                        {category.is_active ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
                                        {category.is_active ? "Disable" : "Enable"}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                {parentCategories.length === 0 && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No categories yet. Create your first category to get started.
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? "Edit Category" : formData.parent_id ? "Add Subcategory" : "Add Category"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!editingCategory && (
                            <div>
                                <label className="text-sm font-medium mb-1 block">Parent Category (optional)</label>
                                <Select
                                    value={formData.parent_id?.toString() || "none"}
                                    onValueChange={(v) => setFormData({ ...formData, parent_id: v === "none" ? null : parseInt(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select parent (or leave empty for main category)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">No Parent (Main Category)</SelectItem>
                                        {parentCategories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium mb-1 block">
                                {formData.parent_id ? "Subcategory Name *" : "Category Name *"}
                            </label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={formData.parent_id ? "e.g. T-Shirts, Blouses" : "e.g. Tops, Dresses"} required />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description" rows={3} />
                        </div>
                        {!formData.parent_id && (
                            <div>
                                <label className="text-sm font-medium mb-1 block">Category Image (Recommended: 400x400)</label>
                                <div className="flex gap-2 items-center">
                                    <input type="file" ref={imageRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    <Button type="button" variant="outline" size="sm" onClick={() => imageRef.current?.click()} disabled={isUploading}>
                                        {isUploading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />} Upload
                                    </Button>
                                    <Input placeholder="Or paste image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="flex-1" />
                                </div>
                                {formData.image_url && (
                                    <div className="mt-2 relative inline-block">
                                        <Image src={formData.image_url} alt="Preview" width={100} height={100} className="rounded-lg object-cover" />
                                        <button type="button" onClick={() => setFormData({ ...formData, image_url: "" })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">{editingCategory ? "Update" : "Create"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
