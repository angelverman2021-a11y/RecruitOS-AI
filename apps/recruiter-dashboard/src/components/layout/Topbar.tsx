export function Topbar() {
  return (
    <header className="flex justify-between items-center w-full px-6 py-3 sticky top-0 z-40 bg-surface/80 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <div className="relative group">
          <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
          <input className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-body-sm font-body-sm w-64 focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Search workspace..." type="text"/>
        </div>
        <nav className="hidden md:flex gap-6">
          <a className="font-body-md text-body-md text-primary dark:text-primary border-b-2 border-primary pb-1" href="#">Workspace</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Direct Hire</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Contracting</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-100">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-100">
            <span className="material-symbols-outlined">apps</span>
          </button>
        </div>
        <div className="h-8 w-px bg-outline-variant/30"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="font-label-md text-label-md font-bold">Alex Rivera</p>
            <p className="text-[10px] text-on-surface-variant">Senior Recruiter</p>
          </div>
          <img alt="User Profile" className="w-10 h-10 rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6ehR4xIM8pCdwSDpnE_G3dRksknwJNwLQ5awCDsbwdqIV_w_npB8KODLgCZRedFfWj3o0Gy7-orNI__40Ony2ee9W_8B19RD0NvvY0pqVRFvLWY5dGEr02q-bRGmWFNfOkcshS_-1HmLtRS6TXdSTfQmerUv3w0qBds3S3_wOytgbu3PywdmHPh_lMHDgoCddj6vA92Ai5XdsHh4f7Xvdgtytyi8AVeY8Wz9u0w8WgtWlm9rQ__4jzEQKCoJJJ-7o3F2bdGiA2M6I"/>
        </div>
      </div>
    </header>
  );
}
