import { Button } from '@/components/ui/button';

const LogoutModal = ({ setShowLogoutModal, onLogout }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all"
            onClick={() => setShowLogoutModal(false)}
        >
            <div className="bg-white p-8 rounded-md shadow-2xl max-w-sm w-full mx-4 border border-custom-gray-2 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
            <h3 className="text-2xl font-bold text-custom-black mb-2 tracking-tight">Sign Out</h3>
            <p className="text-custom-gray mb-8 text-sm">Are you sure you want to end your current session?</p>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
                <Button variant="destructive" onClick={onLogout}>Yes, Sign Out</Button>
            </div>
            </div>
        </div>
    );
}

export default LogoutModal;