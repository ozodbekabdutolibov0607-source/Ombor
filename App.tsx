className={`flex flex-col items-center gap-1 text-xs font-medium ${
          activeTab === 'inventory' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        <Package size={20} />
        <span>Ombor</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('camera');
          startCamera();
        }}
        className={`flex flex-col items-center gap-1 text-xs font-medium ${
          activeTab === 'camera' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        <Camera size={20} />
        <span>Rasm Qidiruvi</span>
      </button>

      {profile?.role === 'admin' && (
        <button
          onClick={() => {
            stopCamera();
            setActiveTab('admin');
          }}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${
            activeTab === 'admin' ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          <Shield size={20} />
          <span>Admin</span>
        </button>
      )}
    </div>
  </nav>
</div>
); }
