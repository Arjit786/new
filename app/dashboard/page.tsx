"use client"

import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MessageSquare, PlusCircle, Share, ThumbsUp, Upload, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/ui/sidebar"
import { useScheduledPosts } from "@/contexts/ScheduledPostsContext"

export default function Dashboard() {
    const { scheduledPosts, addScheduledPost, removeScheduledPost, updateScheduledPost } = useScheduledPosts()
    const [post, setPost] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [uploadType, setUploadType] = useState("url")
    const [hashtags, setHashtags] = useState<string[]>([])
    const [newHashtag, setNewHashtag] = useState("")
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
    const [scheduledTime, setScheduledTime] = useState("12:00")
    const [showConfirmation, setShowConfirmation] = useState(false)
    const { toast } = useToast()

    const addHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newHashtag.trim() !== '') {
            setHashtags([...hashtags, newHashtag.trim()])
            setNewHashtag('')
        }
    }

    const removeHashtag = (tagToRemove: string) => {
        setHashtags(hashtags.filter(tag => tag !== tagToRemove))
    }

    const generateWithAI = async () => {
        try {
            const response = await fetch("/api/optimize-content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: post }),
            })
            const data = await response.json()
            setPost(data.optimizedContent)
            toast({
                title: "Content Optimized",
                description: "Your post has been optimized using AI.",
            })
        } catch (error) {
            console.error("Error optimizing content:", error)
            toast({
                title: "Optimization Failed",
                description: "There was an error optimizing your post. Please try again.",
                variant: "destructive",
            })
        }
    }

    const schedulePost = async () => {
        try {
            if (!scheduledDate) {
                throw new Error("Please select a date")
            }
            const newPost = {
                date: scheduledDate.toISOString().split('T')[0],
                time: scheduledTime,
                content: post,
                type: imageUrl ? 'image' : 'text',
            }
            addScheduledPost({ ...newPost, type: newPost.type as 'image' | 'text' | 'link' })
            setShowConfirmation(true)
            setPost("")
            setImageUrl("")
            setHashtags([])
            toast({
                title: "Post Scheduled",
                description: `Your post has been scheduled for ${scheduledDate.toLocaleDateString()} at ${scheduledTime}`,
            })
        } catch (error) {
            console.error("Error scheduling post:", error)
            toast({
                title: "Scheduling Failed",
                description: "There was an error scheduling your post. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full flex flex-col">
                    <header className="bg-blue-700 text-white px-4 py-3">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4">
                        <Tabs defaultValue="text" className="h-full flex flex-col">
                            <TabsList className="mb-4 bg-blue-100">
                                <TabsTrigger value="text" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Text</TabsTrigger>
                                <TabsTrigger value="image" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Image</TabsTrigger>
                            </TabsList>
                            <ScrollArea className="flex-grow">
                                <TabsContent value="text" className="m-0">
                                    <Card className="border-none shadow-none">
                                        <CardContent className="p-0">
                                            <div className="space-y-4">
                                                <Textarea
                                                    value={post}
                                                    onChange={(e) => setPost(e.target.value)}
                                                    placeholder="Write your LinkedIn post here..."
                                                    className="min-h-[200px] border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <div className="space-y-2">
                                                    <Label htmlFor="hashtags" className="text-blue-700">Hashtags</Label>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {hashtags.map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                                                                #{tag}
                                                                <button onClick={() => removeHashtag(tag)} className="ml-2 text-gray-500 hover:text-gray-700">
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Input
                                                        id="hashtags"
                                                        value={newHashtag}
                                                        onChange={(e) => setNewHashtag(e.target.value)}
                                                        onKeyPress={addHashtag}
                                                        placeholder="Type a hashtag and press Enter"
                                                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex space-x-4">
                                                    <Button onClick={generateWithAI} className="bg-primary text-white hover:bg-primary/90">
                                                        Generate with AI
                                                    </Button>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                Schedule
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[400px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Schedule Post</DialogTitle>
                                                                <DialogDescription>
                                                                    Choose when you want to publish your post.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid gap-2">
                                                                    <Label htmlFor="schedule-date">Date</Label>
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={scheduledDate}
                                                                        onSelect={setScheduledDate}
                                                                        className="rounded-md border"
                                                                    />
                                                                </div>
                                                                <div className="grid gap-2">
                                                                    <Label htmlFor="schedule-time">Time</Label>
                                                                    <Input
                                                                        id="schedule-time"
                                                                        type="time"
                                                                        value={scheduledTime}
                                                                        onChange={(e) => setScheduledTime(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button onClick={schedulePost} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                                                    Confirm Schedule
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button className="bg-primary text-white hover:bg-primary/90">
                                                        Post Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="image" className="m-0">
                                    <Card className="border-none shadow-none">
                                        <CardContent className="p-0">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="upload-type" className="text-blue-700">Upload Type</Label>
                                                    <Select value={uploadType} onValueChange={setUploadType}>
                                                        <SelectTrigger id="upload-type" className="border-blue-200 focus:ring-blue-500">
                                                            <SelectValue placeholder="Select upload type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="url">URL</SelectItem>
                                                            <SelectItem value="file">File Upload</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {uploadType === "url" ? (
                                                    <div>
                                                        <Label htmlFor="image-url" className="text-blue-700">Image URL</Label>
                                                        <Input
                                                            id="image-url"
                                                            value={imageUrl}
                                                            onChange={(e) => setImageUrl(e.target.value)}
                                                            placeholder="Enter image URL"
                                                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Label htmlFor="image-upload" className="text-blue-700">Upload Image</Label>
                                                        <Input
                                                            id="image-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                )}
                                                <Textarea
                                                    value={post}
                                                    onChange={(e) => setPost(e.target.value)}
                                                    placeholder="Write your image caption here..."
                                                    className="min-h-[100px] border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <div className="space-y-2">
                                                    <Label htmlFor="image-hashtags" className="text-blue-700">Hashtags</Label>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {hashtags.map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                                                                #{tag}
                                                                <button onClick={() => removeHashtag(tag)} className="ml-2 text-gray-500 hover:text-gray-700">
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Input
                                                        id="image-hashtags"
                                                        value={newHashtag}
                                                        onChange={(e) => setNewHashtag(e.target.value)}
                                                        onKeyPress={addHashtag}
                                                        placeholder="Type a hashtag and press Enter"
                                                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex space-x-4">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                Schedule
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[400px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Schedule Post</DialogTitle>
                                                                <DialogDescription>
                                                                    Choose when you want to publish your post.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid gap-2">
                                                                    <Label htmlFor="schedule-date">Date</Label>
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={scheduledDate}
                                                                        onSelect={setScheduledDate}
                                                                        className="rounded-md border"
                                                                    />
                                                                </div>
                                                                <div className="grid gap-2">
                                                                    <Label htmlFor="schedule-time">Time</Label>
                                                                    <Input
                                                                        id="schedule-time"
                                                                        type="time"
                                                                        value={scheduledTime}
                                                                        onChange={(e) => setScheduledTime(e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button onClick={schedulePost} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                                                                    Confirm Schedule
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button className="bg-primary text-white hover:bg-primary/90">
                                                        Post Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </ScrollArea>
                        </Tabs>
                    </main>
                </div>
            </div>

            {/* Right Preview */}
            <div className="w-96 bg-white border-l overflow-y-auto">
                <Card className="h-full rounded-none border-none shadow-none">
                    <CardHeader className="bg-primary/10 sticky top-0 z-10">
                        <CardTitle className="text-primary">Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <ScrollArea className="h-[calc(100vh-8rem)]">
                            <div className="bg-white rounded-lg p-6 border border-primary/20 shadow-sm">
                                <div className="flex items-center mb-4">
                                    <Avatar className="mr-2 border-2 border-primary">
                                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />

                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-blue-800">John Doe</p>
                                        <p className="text-sm text-blue-600">1h • 🌎</p>
                                    </div>
                                </div>
                                {imageUrl && (
                                    <img src={imageUrl} alt="Post image" className="mb-4 rounded-lg border border-blue-200" />
                                )}
                                <p className="mb-4 text-blue-800">{post || "Your post preview will appear here..."}</p>
                                {hashtags.length > 0 && (
                                    <p className="text-blue-500 mb-4">
                                        {hashtags.map(tag => `#${tag}`).join(" ")}
                                    </p>
                                )}
                                <div className="flex space-x-4 text-blue-600">
                                    <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700">
                                        <ThumbsUp className="mr-2 h-4 w-4" />
                                        Like
                                    </Button>
                                    <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Comment
                                    </Button>
                                    <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700">
                                        <Share className="mr-2 h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Post Scheduled</DialogTitle>
                        <DialogDescription>
                            Your post has been successfully scheduled for {scheduledDate?.toLocaleDateString()} at {scheduledTime}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center p-4">
                        <Check className="h-16 w-16 text-green-500" />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowConfirmation(false)} className="w-full">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
