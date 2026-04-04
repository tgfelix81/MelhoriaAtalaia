import { BookOpen, LayoutDashboard, Settings, Users, GraduationCap } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const items = [
  { title: 'Dashboard', url: '#', icon: LayoutDashboard, isActive: true },
  { title: 'Relatórios', url: '#', icon: BookOpen },
  { title: 'Estudantes', url: '#', icon: Users },
  { title: 'Configurações', url: '#', icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        <div className="flex items-center gap-2 font-semibold text-lg text-sidebar-primary">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          EduAnálise
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Pedagógica</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive} className="font-medium">
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">Prof. Clara</span>
            <span className="text-xs text-muted-foreground mt-1">Coordenação</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
