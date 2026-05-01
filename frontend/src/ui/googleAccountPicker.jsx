import { motion, AnimatePresence } from "framer-motion";



const mockAccounts = [
  {
    id: "1",
    name: "Meow",
    email: "therania@student.mikroskil.ac.id",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Budi Santoso",
    email: "budi@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Sarah Wijaya",
    email: "sarah.wijaya@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

export function GoogleAccountPicker({
  isOpen,
  onClose,
  onSelectAccount,
  onUseAnotherAccount,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center space-y-4">
                {/* Google G Logo */}
                <div className="flex justify-center">
                  <svg className="h-10 w-10" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h2
                  className="text-xl text-gray-800"
                  style={{ fontFamily: 'var(--font-family-sans)' }}
                >
                  Pilih akun untuk melanjutkan ke{" "}
                  <span className="font-semibold" style={{ color: '#5B8FB9' }}>
                    SnapChef AI
                  </span>
                </h2>
              </div>

              {/* Account List */}
              <div className="px-4">
                {mockAccounts.map((account, index) => (
                  <motion.button
                    key={account.email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectAccount(account)}
                    className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[#FAF7F2] dark:hover:bg-muted"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* Name & Email */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {account.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {account.email}
                      </p>
                    </div>
                  </motion.button>
                ))}

                {/* Divider */}
                <div className="h-px bg-gray-200 my-2" />

                {/* Use Another Account */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onUseAnotherAccount}
                  className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[#FAF7F2] dark:hover:bg-muted"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p
                    className="font-medium"
                    style={{ color: '#5B8FB9' }}
                  >
                    Gunakan akun lain
                  </p>
                </motion.button>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 mt-4">
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Untuk melanjutkan, Google akan membagikan nama, alamat email, dan foto profil Anda dengan SnapChef AI.{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Pelajari Lebih Lanjut
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}import { motion, AnimatePresence } from "framer-motion";



const mockAccounts = [
  {
    id: "1",
    name: "Meow",
    email: "therania@student.mikroskil.ac.id",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Budi Santoso",
    email: "budi@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Sarah Wijaya",
    email: "sarah.wijaya@email.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

export function GoogleAccountPicker({
  isOpen,
  onClose,
  onSelectAccount,
  onUseAnotherAccount,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center space-y-4">
                {/* Google G Logo */}
                <div className="flex justify-center">
                  <svg className="h-10 w-10" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h2
                  className="text-xl text-gray-800"
                  style={{ fontFamily: 'var(--font-family-sans)' }}
                >
                  Pilih akun untuk melanjutkan ke{" "}
                  <span className="font-semibold" style={{ color: '#5B8FB9' }}>
                    SnapChef AI
                  </span>
                </h2>
              </div>

              {/* Account List */}
              <div className="px-4">
                {mockAccounts.map((account, index) => (
                  <motion.button
                    key={account.email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectAccount(account)}
                    className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[#FAF7F2] dark:hover:bg-muted"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* Name & Email */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {account.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {account.email}
                      </p>
                    </div>
                  </motion.button>
                ))}

                {/* Divider */}
                <div className="h-px bg-gray-200 my-2" />

                {/* Use Another Account */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onUseAnotherAccount}
                  className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[#FAF7F2] dark:hover:bg-muted"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p
                    className="font-medium"
                    style={{ color: '#5B8FB9' }}
                  >
                    Gunakan akun lain
                  </p>
                </motion.button>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 mt-4">
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  Untuk melanjutkan, Google akan membagikan nama, alamat email, dan foto profil Anda dengan SnapChef AI.{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Pelajari Lebih Lanjut
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}