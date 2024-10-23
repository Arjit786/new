"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ScheduledPost {
    id: string
    date: string
    time: string
    content: string
    type: 'text' | 'image' | 'link'
}

interface ScheduledPostsContextType {
    scheduledPosts: ScheduledPost[]
    addScheduledPost: (post: Omit<ScheduledPost, 'id'>) => void
    removeScheduledPost: (id: string) => void
    updateScheduledPost: (id: string, updatedPost: Partial<ScheduledPost>) => void
}

const ScheduledPostsContext = createContext<ScheduledPostsContextType | undefined>(undefined)

export function ScheduledPostsProvider({ children }: { children: ReactNode }) {
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])

    const addScheduledPost = (post: Omit<ScheduledPost, 'id'>) => {
        const newPost = { ...post, id: Date.now().toString() }
        setScheduledPosts(prevPosts => [...prevPosts, newPost])
    }

    const removeScheduledPost = (id: string) => {
        setScheduledPosts(prevPosts => prevPosts.filter(post => post.id !== id))
    }

    const updateScheduledPost = (id: string, updatedPost: Partial<ScheduledPost>) => {
        setScheduledPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === id ? { ...post, ...updatedPost } : post
            )
        )
    }

    return (
        <ScheduledPostsContext.Provider
            value={{
                scheduledPosts,
                addScheduledPost,
                removeScheduledPost,
                updateScheduledPost,
            }}
        >
            {children}
        </ScheduledPostsContext.Provider>
    )
}

export function useScheduledPosts() {
    const context = useContext(ScheduledPostsContext)
    if (context === undefined) {
        throw new Error('useScheduledPosts must be used within a ScheduledPostsProvider')
    }
    return context
}