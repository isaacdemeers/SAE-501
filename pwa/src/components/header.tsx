import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Plus, Search, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center gap-4 px-4">
        <a href="#" className="flex items-center gap-2 font-semibold">
          Plan-it
        </a>
        <div className="flex flex-1 items-center gap-4 md:justify-center">
          <form className="flex-1 md:flex-initial md:w-[300px]">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 md:w-[300px] bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </form>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add new</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar className="h-4 w-4" />
            <span className="sr-only">Calendar</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-4 w-4" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  )
}