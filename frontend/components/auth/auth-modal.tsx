"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    redirectPath?: string
    title?: string
    message?: string
}

export function AuthModal({ isOpen, onClose, onSuccess, title = "Create Account", message = "Please create an account to continue" }: AuthModalProps) {
    const { toast } = useToast()
    const [isLogin, setIsLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "", confirmPassword: ""
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isLogin && formData.password !== formData.confirmPassword) {
            toast({ title: "Error", description: "Passwords don't match", variant: "destructive" })
            return
        }

        setIsLoading(true)
        try {
            if (isLogin) {
                // Login
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                })
                const data = await response.json()
                if (!response.ok) throw new Error(data.detail || 'Login failed')

                localStorage.setItem('token', data.access_token)
                localStorage.setItem('user', JSON.stringify(data.user))
                // Trigger storage event for header to update
                window.dispatchEvent(new Event('storage'))
                toast({ title: "Welcome back!", description: `Logged in as ${data.user.first_name}` })
            } else {
                // Register
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        password: formData.password
                    })
                })
                const data = await response.json()
                if (!response.ok) throw new Error(data.detail || 'Registration failed')

                localStorage.setItem('token', data.access_token)
                localStorage.setItem('user', JSON.stringify(data.user))
                // Trigger storage event for header to update
                window.dispatchEvent(new Event('storage'))
                toast({ title: "Account Created!", description: `Welcome, ${data.user.first_name}!` })
            }

            onSuccess()
            onClose()
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 sm:mx-6 bg-[#FCFBF8] rounded-none sm:rounded-xl shadow-2xl border border-[#E8E3DC] p-6 sm:p-8 animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-5 right-5 text-[#6B635E] hover:text-[#1C1615] transition-colors">
                    <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6 sm:mb-8">
                    <h2
                        className="text-2xl sm:text-3xl font-light tracking-wide text-[#1C1615]"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {isLogin ? "Welcome back" : title}
                    </h2>
                    <p
                        className="text-sm text-[#6B635E] mt-2"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        {isLogin ? "Login to continue your purchase." : message}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="firstName" className="text-xs font-semibold tracking-widest text-[#1C1615] uppercase">
                                    First Name
                                </Label>
                                <Input id="firstName" required value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="h-11 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName" className="text-xs font-semibold tracking-widest text-[#1C1615] uppercase">
                                    Last Name
                                </Label>
                                <Input id="lastName" required value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="h-11 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="email" className="text-xs font-semibold tracking-widest text-[#1C1615] uppercase">
                            Email
                        </Label>
                        <Input id="email" type="email" required value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-11 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-xs font-semibold tracking-widest text-[#1C1615] uppercase">
                            Password
                        </Label>
                        <Input id="password" type="password" required value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="h-11 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <Label htmlFor="confirmPassword" className="text-xs font-semibold tracking-widest text-[#1C1615] uppercase">
                                Confirm Password
                            </Label>
                            <Input id="confirmPassword" type="password" required value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="h-11 border-[#E8E3DC] bg-[#FCFBF8] focus-visible:ring-[#D8B4A0] rounded-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-11 mt-2 bg-[#1C1615] hover:bg-[#D8B4A0] text-[#FCFBF8] hover:text-[#1C1615] rounded-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-none hover:shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        {isLogin ? "Login" : "Create Account"}
                    </Button>
                </form>

                <div className="mt-5 text-center text-sm text-[#6B635E]" style={{ fontFamily: "var(--font-body)" }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#1C1615] font-semibold hover:text-[#D8B4A0] underline-offset-4 hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}
