import { sidebarData } from './sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { NavUserButtons } from './nav-user-buttons'

export function AppSidebar() {
  return (
    <aside className='w-48 border-r bg-sidebar flex flex-col h-screen sticky top-0'>
      {/* User Info */}
      <div className='p-4'>
        <NavUser user={sidebarData.user} />
      </div>

      {/* Content */}
      <div className='flex-1 overflow-auto px-3 pb-2'>
        {sidebarData.navGroups.map((props, index) => (
          <NavGroup key={props.title} {...props} isFirst={index === 0} />
        ))}
      </div>

      {/* User Buttons */}
      <div className='p-4'>
        <NavUserButtons />
      </div>
    </aside>
  )
}
