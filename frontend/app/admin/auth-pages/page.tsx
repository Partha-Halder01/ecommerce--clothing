"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Save, Upload, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { settingsAPI, getCurrentUser, getAuthToken, AuthPagesSettings } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function AdminAuthPages() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [uploadingField, setUploadingField] = useState<"login_image" | "signup_image" | null>(null)
    const loginFileRef = useRef<HTMLInputElement>(null)
    const signupFileRef = useRef<HTMLInputElement>(null)
    const [settings, setSettings] = useState<AuthPagesSettings>({ login_image: "", signup_image: "" })

    useEffect(() => {
        const user = getCurrentUser()
        if (!user || !user.is_admin) { router.push("/login"); return }
        settingsAPI.getAuthPages().then(setSettings).catch(() => { }).finally(() => setIsLoading(false))
    }, [router])

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "login_image" | "signup_image") => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingField(field)
        const url = await uploadImage(file)
        if (url) setSettings(prev => ({ ...prev, [field]: url }))
        setUploadingField(null)
        e.target.value = ""
    }

    const saveSettings = async () => {
        setIsSaving(true)
        try {
            await settingsAPI.updateAuthPages(settings)
            toast({ title: "Success", description: "Settings saved" })
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        } finally { setIsSaving(false) }
    }

    if (isLoading) return <div className="p-8 flex items-center justify-center"><p>Loading...</p></div>

    return (
        <div className="p-8 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-light text-[#1C1615] uppercase tracking-widest" style={{ fontFamily: "var(--font-playfair)" }}>Login &amp; Signup Images</h1>
                    <p className="text-muted-foreground">Manage the background images on the Login and Signup pages</p>
                </div>
                <Button onClick={saveSettings} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />{isSaving ? "Saving..." : "Save"}
                </Button>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Login Page</CardTitle>
                        <CardDescription>Background image shown beside the login form</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2 items-center flex-wrap">
                            <input type="file" ref={loginFileRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "login_image")} />
                            <Button type="button" variant="outline" size="sm" onClick={() => loginFileRef.current?.click()} disabled={uploadingField === "login_image"}>
                                {uploadingField === "login_image" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />} Upload
                            </Button>
                            <span className="text-[#6B635E]/70 text-sm">or</span>
                            <Input
                                placeholder="Paste image URL"
                                value={settings.login_image}
                                onChange={(e) => setSettings(prev => ({ ...prev, login_image: e.target.value }))}
                                className="flex-1 min-w-[200px]"
                            />
                        </div>
                        {settings.login_image && (
                            <div className="rounded-lg overflow-hidden bg-black aspect-video max-w-md">
                                <img src={settings.login_image} alt="Login preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Signup Page</CardTitle>
                        <CardDescription>Background image shown beside the signup form</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2 items-center flex-wrap">
                            <input type="file" ref={signupFileRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, "signup_image")} />
                            <Button type="button" variant="outline" size="sm" onClick={() => signupFileRef.current?.click()} disabled={uploadingField === "signup_image"}>
                                {uploadingField === "signup_image" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Upload className="w-4 h-4 mr-1" />} Upload
                            </Button>
                            <span className="text-[#6B635E]/70 text-sm">or</span>
                            <Input
                                placeholder="Paste image URL"
                                value={settings.signup_image}
                                onChange={(e) => setSettings(prev => ({ ...prev, signup_image: e.target.value }))}
                                className="flex-1 min-w-[200px]"
                            />
                        </div>
                        {settings.signup_image && (
                            <div className="rounded-lg overflow-hidden bg-black aspect-video max-w-md">
                                <img src={settings.signup_image} alt="Signup preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
