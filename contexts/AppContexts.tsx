"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the shape of your context state
interface AppContextState {
    // Add your state properties here
    username: string
    isLoggedIn: boolean
}

// Define the shape of your context
interface AppContextValue extends AppContextState {
    // Add your methods here
    setUsername: (username: string) => void
    setIsLoggedIn: (isLoggedIn: boolean) => void
}

// Create the context
const AppContext = createContext<AppContextValue | undefined>(undefined)

// Create a provider component
export function AppProvider({ children }: { children: ReactNode }) {
    const [username, setUsername] = useState<string>('')
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    const value: AppContextValue = {
        username,
        isLoggedIn,
        setUsername,
        setIsLoggedIn,
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Create a custom hook to use the context
export function useAppContext() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider')
    }
    return context
}